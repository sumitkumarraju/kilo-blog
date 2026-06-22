import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useAuthStore } from '@/lib/auth-store';
import type { CreateCommentInput } from '@/types/api';
import { Link } from 'react-router-dom';

interface Props {
  onSubmit: (input: CreateCommentInput) => Promise<unknown>;
  parentId?: string | null;
  placeholder?: string;
  compact?: boolean;
  onDone?: () => void;
}

export function CommentForm({
  onSubmit,
  parentId = null,
  placeholder = 'Join the conversation',
  compact = false,
  onDone,
}: Props) {
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <div className="rounded-xl border border-line bg-surface-2/60 p-5 text-sm text-muted">
        <Link to="/login" className="text-ink underline underline-offset-2">
          Sign in
        </Link>{' '}
        to leave a comment.
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    try {
      await onSubmit({ content, parentId });
      setContent('');
      toast.success('Comment submitted for review');
      onDone?.();
    } catch {
      toast.error('Could not post comment');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 3 : 4}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Comments are reviewed before they appear.
        </p>
        <Button
          type="submit"
          loading={busy}
          disabled={!content.trim()}
          size={compact ? 'sm' : 'md'}
        >
          Post comment
        </Button>
      </div>
    </form>
  );
}
