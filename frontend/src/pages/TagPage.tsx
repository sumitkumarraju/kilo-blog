import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import type { Post, Tag as TagT } from '@/types/api';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { stagger, viewportOnce } from '@/lib/motion-presets';

export function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const [tag, setTag] = useState<TagT | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      api.tags.bySlug(slug).catch(() => null),
      api.posts.list({ tag: slug, size: 24, sort: 'newest' }),
    ])
      .then(([t, p]) => {
        setTag(t);
        setPosts(p.content);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="container-page py-16">
      <header className="border-b border-line pb-12">
        <Link
          to="/articles"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
        >
          ← All articles
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <span
            className="size-3 rounded-full"
            style={{ background: tag?.color ?? 'var(--color-accent)' }}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            Topic
          </span>
        </div>
        <h1
          className="mt-4 font-serif text-balance leading-[0.95] tracking-tight text-ink"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 500 }}
        >
          {tag?.name ?? slug}
        </h1>
        {tag?.description && (
          <p className="mt-6 max-w-2xl text-lg text-muted">{tag.description}</p>
        )}
      </header>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger(0.04)}
        className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : posts.map((p) => <ArticleCard key={p.id} post={p} variant="default" />)}
      </motion.section>

      {!loading && posts.length === 0 && (
        <div className="mt-16 rounded-2xl border border-dashed border-line p-16 text-center">
          <p className="font-serif text-2xl text-ink">Nothing here yet.</p>
          <p className="mt-2 text-muted">
            No articles have been published with this topic.
          </p>
          <div className="mt-6">
            <Link to="/articles">
              <Button variant="outline">Browse all articles</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
