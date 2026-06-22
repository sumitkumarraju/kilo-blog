import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { fmtRelative, initials } from '@/lib/format';
import type { Post } from '@/types/api';

interface Props {
  post: Post;
  onApprove: (id: string) => Promise<unknown>;
  onReject: (id: string, reason: string) => Promise<unknown>;
}

export function PendingPostRow({ post, onApprove, onReject }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const author = post.author;
  const authorName = author.displayName ?? author.email;

  async function approve() {
    setBusy(true);
    try {
      await onApprove(post.id);
      toast.success('Approved');
    } catch {
      toast.error('Could not approve');
    } finally {
      setBusy(false);
    }
  }

  async function reject() {
    if (!reason.trim()) {
      toast.error('Add a brief reason');
      return;
    }
    setBusy(true);
    try {
      await onReject(post.id, reason);
      toast.success('Rejected');
      setOpen(false);
    } catch {
      toast.error('Could not reject');
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl border border-line bg-paper p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-line bg-surface-2 font-mono text-[10px] uppercase text-ink">
              {initials(authorName)}
            </span>
            <span className="text-ink">
              {authorName}
            </span>
            <span className="opacity-50">·</span>
            <span className="font-mono uppercase tracking-[0.06em]">
              {fmtRelative(post.updatedAt)}
            </span>
          </div>
          <h3 className="mt-2 font-serif text-xl leading-snug text-ink">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-muted">
              {post.excerpt}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {post.tags?.slice(0, 4).map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: t.color ?? 'var(--color-accent)' }}
                />
                {t.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Link
            to={`/article/${post.slug}`}
            target="_blank"
            className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-line px-3 text-xs text-ink transition-colors duration-160 hover:border-ink"
          >
            Preview
            <ExternalLink className="size-3" strokeWidth={1.75} />
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen((o) => !o)}
          >
            <X className="size-3.5" strokeWidth={1.75} />
            Reject
          </Button>
          <Button size="sm" onClick={approve} loading={busy}>
            <Check className="size-3.5" strokeWidth={1.75} />
            Approve
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-line pt-4">
              <Textarea
                label="Rejection reason"
                placeholder="What needs to change before this can run?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={reject}
                  loading={busy}
                >
                  Send rejection
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
