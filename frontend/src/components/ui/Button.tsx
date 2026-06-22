import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost' | 'outline' | 'subtle' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-paper hover:bg-ink/90 border border-ink',
  ghost:
    'bg-transparent text-ink hover:bg-surface-2 border border-transparent',
  outline:
    'bg-transparent text-ink hover:border-ink border border-line',
  subtle:
    'bg-surface-2 text-ink hover:bg-line/60 border border-transparent',
  danger:
    'bg-transparent text-accent border border-accent/40 hover:bg-accent hover:text-paper',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex select-none items-center justify-center rounded-full font-medium tracking-tight',
          'cursor-pointer outline-none transition-colors duration-160',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="size-3 animate-spin rounded-full border-[1.5px] border-current border-r-transparent" />
            {children}
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);
Button.displayName = 'Button';
