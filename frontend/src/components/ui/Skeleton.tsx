import clsx from 'clsx';

interface Props {
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Skeleton({ className, as: As = 'div' }: Props) {
  return (
    <As
      className={clsx(
        'relative overflow-hidden rounded-md bg-surface-2',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent',
        'before:animate-[shimmer_2s_infinite]',
        className,
      )}
    />
  );
}
