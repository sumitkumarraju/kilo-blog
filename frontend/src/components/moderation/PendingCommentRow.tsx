import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { fmtRelative, initials } from '@/lib/format';
import type { Comment } from '@/types/api';
import { useState } from 'react';

interface Props {
  comment: Comment;
  onApprove: (id: string) => Promise<unknown>;
  onReject: (id: string) => Promise<unknown>;
}

export function PendingCommentRow({ comment, onApprove, onReject }: Props) {
  const [busy, setBusy] = useState(false);
  const author = comment.author;
  const displayName =
    author?.displayName ?? author?.email ?? comment.guestName ?? 'Anonymous';

  async function approve() {
    setBusy(true);
    try {
      await onApprove(comment.id);
      toast.success('Approved');
    } catch {
      toast.error('Could not approve');
    } finally {
      setBusy(false);
    }
  }

  async function reject() {
    setBusy(true);
    try {
      await onReject(comment.id);
      toast.success('Removed');
    } catch {
      toast.error('Could not remove');
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
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-surface-2 font-mono text-[11px] uppercase text-ink">
          {initials(displayName)}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="text-ink">{displayName}</span>
            <span className="opacity-50">·</span>
            <span className="font-mono uppercase tracking-[0.06em]">
              {fmtRelative(comment.createdAt)}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-[15px] text-ink">
            {comment.content}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={reject}
            loading={busy}
          >
            <X className="size-3.5" strokeWidth={1.75} />
            Remove
          </Button>
          <Button size="sm" onClick={approve} loading={busy}>
            <Check className="size-3.5" strokeWidth={1.75} />
            Approve
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
