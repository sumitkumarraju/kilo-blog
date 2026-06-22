import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { TagFilter } from '@/components/blog/TagFilter';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePosts } from '@/hooks/use-posts';
import { useTags } from '@/hooks/use-tags';
import { stagger, viewportOnce } from '@/lib/motion-presets';

export function ArticlesPage() {
  const { tags } = useTags();
  const [tag, setTag] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);

  const params = useMemo(
    () => ({
      page,
      size: 9,
      tag: tag ?? undefined,
      q: q.trim() ? q : undefined,
      sort: 'newest' as const,
    }),
    [page, tag, q],
  );

  const { data, loading } = usePosts(params);

  return (
    <div className="container-page py-16">
      <header className="border-b border-line pb-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          The archive
        </span>
        <h1 className="mt-4 font-serif text-balance leading-[0.95] tracking-tight text-ink"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 500 }}>
          Every <span className="italic">word</span>, since the first issue.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          A growing collection of essays, interviews, and field notes from our
          contributors and editors.
        </p>
      </header>

      <div className="sticky top-[68px] z-30 -mx-2 mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-paper/95 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
          />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search this archive…"
            className="h-10 w-full rounded-full border border-line bg-paper pl-10 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <TagFilter
            tags={tags}
            selected={tag}
            onSelect={(slug) => {
              setTag(slug);
              setPage(0);
            }}
          />
        </div>
      </div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger(0.05)}
        className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : data && data.content.length > 0 ? (
          data.content.map((p) => <ArticleCard key={p.id} post={p} variant="default" />)
        ) : (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState
              title="No articles match."
              description="Try clearing filters or searching for a different keyword."
              icon={Search}
            />
          </div>
        )}
      </motion.section>

      {data && data.totalPages > 1 && (
        <nav className="mt-16 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={data.first}
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
            Previous
          </Button>
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
            Page {data.number + 1} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={data.last}
          >
            Next
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </Button>
        </nav>
      )}
    </div>
  );
}
