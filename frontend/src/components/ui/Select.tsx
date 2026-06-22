import { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, className, id, children, ...rest }, ref) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={clsx(
              'h-11 w-full appearance-none rounded-lg border border-line bg-transparent px-3.5 pr-10 text-[15px] text-ink',
              'transition-colors duration-160 focus:border-ink focus:outline-none cursor-pointer',
              className,
            )}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        </div>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
    );
  },
);
Select.displayName = 'Select';
