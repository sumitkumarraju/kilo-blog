import clsx from 'clsx';
import { fmtDate } from '@/lib/format';
import { initials } from '@/lib/format';
import type { Post } from '@/types/api';
import { Dot } from 'lucide-react';

interface Props {
  post: Post;
  className?: string;
}

export function PostMeta({ post, className }: Props) {
  const author = post.author;
  const name = author.displayName ?? author.email;
  const reading = post.readingTimeMinutes ?? 0;

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-1.5 text-sm text-muted',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <Avatar user={author} />
        <span className="text-ink">{name}</span>
      </div>
      <Dot className="size-3 opacity-50" />
      <span className="font-mono text-[12px] uppercase tracking-[0.06em]">
        {fmtDate(post.publishedAt ?? post.createdAt)}
      </span>
      {reading > 0 && (
        <>
          <Dot className="size-3 opacity-50" />
          <span className="font-mono text-[12px] uppercase tracking-[0.06em]">
            {reading} min read
          </span>
        </>
      )}
    </div>
  );
}

function Avatar({ user }: { user: Post['author'] }) {
  const name = user.displayName ?? user.email;
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={name}
        className="size-7 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full border border-line bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-ink">
      {initials(name)}
    </span>
  );
}
