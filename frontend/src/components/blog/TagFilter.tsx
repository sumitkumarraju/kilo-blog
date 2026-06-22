import { Tag } from '@/components/ui/Tag';
import type { Tag as TagT } from '@/types/api';

interface Props {
  tags: TagT[];
  selected?: string | null;
  onSelect?: (slug: string | null) => void;
}

export function TagFilter({ tags, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onSelect?.(null)}
        className={`inline-flex h-8 cursor-pointer items-center rounded-full border px-3.5 text-xs font-medium transition-colors duration-160 ${
          !selected
            ? 'bg-ink text-paper border-ink'
            : 'border-line text-ink hover:border-ink'
        }`}
      >
        All
      </button>
      {tags.map((t) => (
        <Tag
          key={t.id}
          tag={t}
          asLink={false}
          selected={selected === t.slug}
          onClick={() => onSelect?.(t.slug)}
        />
      ))}
    </div>
  );
}
