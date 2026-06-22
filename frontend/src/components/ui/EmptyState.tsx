import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line px-8 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full border border-line text-muted">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-serif text-xl text-ink">{title}</h3>
        {description && (
          <p className="text-sm text-muted max-w-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
