import clsx from 'clsx';
import { Link } from 'react-router-dom';
import type { Tag as TagT } from '@/types/api';

interface Props {
  tag: TagT;
  size?: 'sm' | 'md';
  asLink?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tag({
  tag,
  size = 'md',
  asLink = true,
  selected,
  onClick,
  className,
}: Props) {
  const cls = clsx(
    'inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight transition-colors duration-160 cursor-pointer',
    size === 'sm' ? 'h-6 px-2.5 text-[11px]' : 'h-8 px-3.5 text-xs',
    selected
      ? 'bg-ink text-paper border-ink'
      : 'border-line bg-transparent text-ink hover:border-ink',
    className,
  );

  const dot = (
    <span
      aria-hidden
      className="size-1.5 rounded-full"
      style={{ background: tag.color ?? 'var(--color-accent)' }}
    />
  );

  if (asLink && !onClick) {
    return (
      <Link to={`/tag/${tag.slug}`} className={cls}>
        {dot}
        <span>{tag.name}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {dot}
      <span>{tag.name}</span>
    </button>
  );
}
