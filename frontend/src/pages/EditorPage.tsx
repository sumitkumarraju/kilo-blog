import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Send, Save, Globe, Sparkles, FileWarning } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore, hasRole } from '@/lib/auth-store';
import { useTags } from '@/hooks/use-tags';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { CoverImagePicker } from '@/components/editor/CoverImagePicker';
import type { Post, PostStatus } from '@/types/api';
import { fmtRelative, slugify } from '@/lib/format';

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { tags: allTags } = useTags();

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugLocked, setSlugLocked] = useState(true);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [status, setStatus] = useState<PostStatus>('DRAFT');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const initialized = useRef(false);

  // load
  useEffect(() => {
    if (!id || id === 'new') {
      initialized.current = true;
      return;
    }
    api.posts
      .byId(id)
      .then((p) => {
        setPost(p);
        setTitle(p.title);
        setSlug(p.slug);
        setExcerpt(p.excerpt ?? '');
        setContent(p.content ?? '');
        setCoverImageUrl(p.coverImageUrl ?? '');
        setTagIds(p.tags.map((t) => t.id));
        setStatus(p.status);
        if (p.updatedAt) setLastSavedAt(new Date(p.updatedAt));
        initialized.current = true;
      })
      .catch(() => {
        toast.error('Could not load post');
        navigate('/dashboard');
      });
  }, [id, navigate]);

  // slug auto-derive
  useEffect(() => {
    if (slugLocked && title) {
      setSlug(slugify(title));
    }
  }, [title, slugLocked]);

  const markDirty = useCallback(() => {
    if (initialized.current) setSaveState('dirty');
  }, []);

  // debounced autosave
  useEffect(() => {
    if (saveState !== 'dirty') return;
    const timer = setTimeout(async () => {
      await persist({ silent: true });
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState, title, slug, excerpt, content, coverImageUrl, tagIds]);

  function selectedTagSlugs(): string[] {
    const map = new Map(allTags.map((t) => [t.id, t.slug] as const));
    return tagIds
      .map((id) => map.get(id))
      .filter((s): s is string => Boolean(s));
  }

  async function persist(opts: { silent?: boolean } = {}) {
    if (!title.trim()) {
      if (!opts.silent) toast.error('Add a title before saving');
      return null;
    }
    setSaveState('saving');
    try {
      const tagSlugs = selectedTagSlugs();
      let saved: Post;
      if (!post) {
        saved = await api.posts.create({
          title: title || 'Untitled draft',
          excerpt: excerpt || undefined,
          content: content || '<p></p>',
          coverImageUrl: coverImageUrl || undefined,
          tagSlugs,
        });
        setPost(saved);
        window.history.replaceState(null, '', `/editor/${saved.id}`);
      } else {
        saved = await api.posts.update(post.slug, {
          title,
          excerpt,
          content,
          coverImageUrl: coverImageUrl || undefined,
          tagSlugs,
        });
        setPost(saved);
      }
      setStatus(saved.status);
      setLastSavedAt(new Date());
      setSaveState('saved');
      if (!opts.silent) toast.success('Saved');
      return saved;
    } catch (e) {
      setSaveState('error');
      if (!opts.silent) toast.error('Could not save');
      return null;
    }
  }

  async function submitForReview() {
    const saved = (await persist({ silent: true })) ?? post;
    if (!saved) return;
    try {
      const next = await api.posts.submit(saved.id);
      setStatus(next.status);
      toast.success('Sent to editors for review');
    } catch {
      toast.error('Could not submit');
    }
  }

  async function publish() {
    const saved = (await persist({ silent: true })) ?? post;
    if (!saved) return;
    try {
      // Backend approve only works on PENDING_REVIEW posts; ensure submission first.
      let target = saved;
      if (target.status !== 'PENDING_REVIEW') {
        target = await api.posts.submit(target.id);
      }
      const next = await api.posts.publish(target.id);
      setStatus(next.status);
      toast.success('Published');
    } catch {
      toast.error('Could not publish');
    }
  }

  const canPublish = hasRole(user, ['EDITOR', 'ADMIN']);
  const indicator = useMemo<{ label: string; tone: 'muted' | 'accent' | 'success' }>(() => {
    if (saveState === 'saving') return { label: 'Saving…', tone: 'accent' };
    if (saveState === 'error') return { label: 'Save failed', tone: 'accent' };
    if (saveState === 'dirty') return { label: 'Unsaved changes', tone: 'accent' };
    if (lastSavedAt)
      return { label: `Saved ${fmtRelative(lastSavedAt.toISOString())}`, tone: 'success' };
    return { label: 'Untouched', tone: 'muted' };
  }, [saveState, lastSavedAt]);

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3 text-sm text-muted transition-colors duration-160 hover:text-ink"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} />
          Back to dashboard
        </Link>
        <div className="flex items-center gap-3">
          <SaveBadge tone={indicator.tone} label={indicator.label} />
          <Badge tone={statusTone(status)}>{status.toLowerCase()}</Badge>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              markDirty();
            }}
            placeholder="An attentive title"
            className="w-full bg-transparent font-serif text-balance text-5xl font-medium leading-[1] tracking-tight text-ink placeholder:text-muted/50 focus:outline-none sm:text-6xl"
          />

          <div className="mt-10">
            <TiptapEditor
              value={content}
              onChange={(html) => {
                setContent(html);
                markDirty();
              }}
            />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-6 rounded-2xl border border-line bg-paper p-6">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Slug
                </label>
                <button
                  type="button"
                  onClick={() => setSlugLocked((l) => !l)}
                  className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent transition-colors duration-160 hover:opacity-80"
                >
                  {slugLocked ? 'Edit' : 'Auto'}
                </button>
              </div>
              <input
                value={slug}
                readOnly={slugLocked}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  markDirty();
                }}
                className="mt-1.5 h-11 w-full rounded-lg border border-line bg-transparent px-3.5 font-mono text-sm text-ink focus:border-ink focus:outline-none disabled:text-muted"
              />
            </div>

            <Textarea
              label="Excerpt"
              placeholder="A short summary, shown in feeds"
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                markDirty();
              }}
              rows={3}
            />

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                Tags
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {allTags.map((t) => {
                  const active = tagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTagIds((prev) =>
                          active
                            ? prev.filter((x) => x !== t.id)
                            : [...prev, t.id],
                        );
                        markDirty();
                      }}
                      className={`inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors duration-160 ${
                        active
                          ? 'bg-ink text-paper border-ink'
                          : 'border-line text-ink hover:border-ink'
                      }`}
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ background: t.color ?? 'var(--color-accent)' }}
                      />
                      {t.name}
                    </button>
                  );
                })}
                {allTags.length === 0 && (
                  <p className="text-xs text-muted">No tags available yet.</p>
                )}
              </div>
            </div>

            <CoverImagePicker
              value={coverImageUrl}
              onChange={(v) => {
                setCoverImageUrl(v);
                markDirty();
              }}
            />

            {post?.rejectionReason && status === 'REJECTED' && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm"
              >
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                  <FileWarning className="size-3.5" strokeWidth={1.75} /> Editor feedback
                </p>
                <p className="mt-2 text-ink">{post.rejectionReason}</p>
              </motion.div>
            )}

            <div className="space-y-2 border-t border-line pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => persist()}
                disabled={saveState === 'saving'}
              >
                <Save className="size-4" strokeWidth={1.75} />
                Save draft
              </Button>
              {status !== 'PUBLISHED' && (
                <Button variant="primary" fullWidth onClick={submitForReview}>
                  <Send className="size-4" strokeWidth={1.75} />
                  Submit for review
                </Button>
              )}
              {canPublish && status !== 'PUBLISHED' && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={publish}
                  className="bg-accent border-accent text-paper hover:bg-accent/90"
                >
                  <Globe className="size-4" strokeWidth={1.75} />
                  Publish now
                </Button>
              )}
              {status === 'PUBLISHED' && (
                <Link
                  to={`/article/${slug}`}
                  className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-line text-sm text-ink transition-colors duration-160 hover:border-ink"
                >
                  <Sparkles className="size-4" strokeWidth={1.75} />
                  View public page
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SaveBadge({
  tone,
  label,
}: {
  tone: 'muted' | 'accent' | 'success';
  label: string;
}) {
  const color =
    tone === 'accent'
      ? 'text-accent'
      : tone === 'success'
        ? 'text-ink'
        : 'text-muted';
  return (
    <motion.span
      key={label}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] ${color}`}
    >
      {tone === 'success' && <Check className="size-3" strokeWidth={2} />}
      {label}
    </motion.span>
  );
}

function statusTone(status: PostStatus) {
  switch (status) {
    case 'PUBLISHED':
      return 'success' as const;
    case 'REJECTED':
      return 'danger' as const;
    case 'PENDING_REVIEW':
      return 'warning' as const;
    case 'ARCHIVED':
      return 'muted' as const;
    default:
      return 'neutral' as const;
  }
}
