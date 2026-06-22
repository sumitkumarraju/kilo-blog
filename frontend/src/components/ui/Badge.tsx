import clsx from 'clsx';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'muted' | 'success' | 'warning' | 'danger';
  className?: string;
}

const toneClasses: Record<NonNullable<Props['tone']>, string> = {
  neutral: 'bg-surface-2 text-ink',
  accent: 'bg-accent/15 text-accent',
  muted: 'bg-transparent text-muted border border-line',
  success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

export function Badge({ children, tone = 'neutral', className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
