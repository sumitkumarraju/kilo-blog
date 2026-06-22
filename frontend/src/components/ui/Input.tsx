import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...rest }, ref) => {
    const inputId = id ?? rest.name ?? Math.random().toString(36).slice(2);
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'h-11 rounded-lg border bg-transparent px-3.5 text-[15px] text-ink',
            'placeholder:text-muted/70',
            'transition-colors duration-160',
            error
              ? 'border-accent'
              : 'border-line focus:border-ink focus:outline-none',
            className,
          )}
          {...rest}
        />
        {error ? (
          <span className="text-xs text-accent">{error}</span>
        ) : hint ? (
          <span className="text-xs text-muted">{hint}</span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
