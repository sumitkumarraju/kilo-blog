import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { FilePlus, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { fmtDate, fmtRelative } from '@/lib/format';
import type { Post, PostStatus } from '@/types/api';

type Tab = 'all' | 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'DRAFT', label: 'Drafts' },
  { id: 'PENDING_REVIEW', label: 'In review' },
  { id: 'PUBLISHED', label: 'Published' },
  { id: 'REJECTED', label: 'Rejected' },
];

export function DashboardPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.posts
      .mine({ size: 50 })
      .then((p) => setAllPosts(p.content))
      .catch(() => setAllPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const posts = useMemo(() => {
    if (tab === 'all') return allPosts;
    return allPosts.filter((p) => p.status === (tab as PostStatus));
  }, [allPosts, tab]);

  const totals = useMemo(() => {
    return {
      drafts: allPosts.filter((p) => p.status === 'DRAFT').length,
      submitted: allPosts.filter((p) => p.status === 'PENDING_REVIEW').length,
      published: allPosts.filter((p) => p.status === 'PUBLISHED').length,
    };
  }, [allPosts]);

  return (
    <div className="container-page py-16">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-10">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Workshop
          </span>
          <h1
            className="mt-3 font-serif text-balance leading-[0.95] tracking-tight text-ink"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 500 }}
          >
            Your writing desk.
          </h1>
        </div>
        <Link to="/editor/new">
          <Button>
            <FilePlus className="size-4" strokeWidth={1.75} />
            New post
          </Button>
        </Link>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile label="Drafts" value={totals.drafts} />
        <StatTile label="In review" value={totals.submitted} />
        <StatTile label="Published" value={totals.published} />
      </div>

      <div className="mt-12 flex items-center gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative inline-flex h-10 cursor-pointer items-center px-4 text-sm transition-colors duration-160 ${
              tab === t.id ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="dashboard-tab"
                transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-x-2 -bottom-px h-0.5 bg-ink"
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={FilePlus}
            title="Nothing in this stack yet."
            description="Start a draft and we'll keep it safe here."
            action={
              <Link to="/editor/new">
                <Button>Start writing</Button>
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            <AnimatePresence mode="popLayout">
              {posts.map((p) => (
                <Row key={p.id} post={p} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <p className="mt-4 font-serif text-4xl font-medium leading-none tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

function Row({ post }: { post: Post }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        to={`/editor/${post.id}`}
        className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-5 transition-colors duration-200 hover:border-ink"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <Badge tone={tone(post.status)}>{post.status.toLowerCase()}</Badge>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {fmtDate(post.updatedAt)}
            </span>
          </div>
          <h3 className="mt-2 font-serif text-xl text-ink transition-colors duration-200 group-hover:text-accent">
            {post.title || 'Untitled draft'}
          </h3>
          {post.excerpt && (
            <p className="mt-1 line-clamp-1 max-w-2xl text-sm text-muted">
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="flex items-center gap-5 text-xs text-muted">
          {post.viewCount != null && (
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-3.5" strokeWidth={1.75} />
              {post.viewCount}
            </span>
          )}
          <span className="font-mono uppercase tracking-[0.06em]">
            edited {fmtRelative(post.updatedAt)}
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

function tone(status: PostStatus) {
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
