import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useFeaturedPosts, usePosts } from '@/hooks/use-posts';
import { useTags } from '@/hooks/use-tags';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { stagger, viewportOnce, childFadeUp, easeOut } from '@/lib/motion-presets';
import { Tag } from '@/components/ui/Tag';

export function HomePage() {
  const reduce = useReducedMotion();
  const { posts: featured, loading: featuredLoading } = useFeaturedPosts();
  const { data: latest, loading: latestLoading } = usePosts({
    size: 9,
    sort: 'newest',
  });
  const { tags } = useTags();

  const lead = featured[0];
  const secondaries = featured.slice(1, 3);

  return (
    <div className="container-page pt-10">
      <section className="relative pb-16">
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="visible"
          variants={stagger(0.08)}
          className="flex flex-col"
        >
          <motion.div
            variants={childFadeUp}
            className="flex items-baseline justify-between"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Issue 06 · Spring 2026
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:inline">
              Kilo Journal
            </span>
          </motion.div>

          <motion.h1
            variants={childFadeUp}
            transition={{ duration: 0.8, ease: easeOut }}
            className="mt-8 max-w-[1100px] font-serif text-balance leading-[0.92] tracking-tightest text-ink"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 9rem)',
              fontWeight: 500,
            }}
          >
            Words that take{' '}
            <span className="italic text-accent">their time</span> finding the
            page.
          </motion.h1>

          <motion.div
            variants={childFadeUp}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12"
          >
            <p className="md:col-span-7 max-w-2xl text-lg leading-relaxed text-muted">
              An editorial home for slow, careful writing on design, software,
              and the strange shape of working in the early 2020s. New essays
              every Thursday morning, no algorithms.
            </p>
            <div className="md:col-span-5 flex items-end md:justify-end">
              <Link to="/articles" className="group">
                <Button variant="primary" size="lg" className="gap-3">
                  <span>Read the issue</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative border-t border-line py-16">
        <SectionHeader
          eyebrow="Featured"
          title="Reading worth setting aside an hour for."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger(0.06)}
          className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5"
        >
          {featuredLoading ? (
            <FeatureSkeleton />
          ) : lead ? (
            <>
              <div className="lg:col-span-3">
                <ArticleCard post={lead} variant="featured" />
              </div>
              <div className="space-y-12 lg:col-span-2">
                {secondaries.map((p, i) => (
                  <ArticleCard
                    key={p.id}
                    post={p}
                    variant="default"
                    index={i}
                  />
                ))}
                {secondaries.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
                    More features arriving soon.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="lg:col-span-5 rounded-2xl border border-dashed border-line p-16 text-center text-muted">
              No featured articles yet.
            </div>
          )}
        </motion.div>
      </section>

      <section className="border-t border-line py-16">
        <SectionHeader
          eyebrow="Latest"
          title="From the desk this week."
          action={
            <Link
              to="/articles"
              className="inline-flex h-9 cursor-pointer items-center gap-1 text-sm text-ink underline-grow"
            >
              View archive <ArrowRight className="size-3.5" strokeWidth={1.75} />
            </Link>
          }
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger(0.05)}
          className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {latestLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : latest?.content.map((p) => (
                <ArticleCard key={p.id} post={p} variant="default" />
              ))}
        </motion.div>
      </section>

      {tags.length > 0 && (
        <section className="border-t border-line py-16">
          <SectionHeader eyebrow="Browse" title="By topic." />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger(0.025)}
            className="mt-10 flex flex-wrap gap-2"
          >
            {tags.map((t) => (
              <motion.span key={t.id} variants={childFadeUp}>
                <Tag tag={t} />
              </motion.span>
            ))}
          </motion.div>
        </section>
      )}

      <NewsletterStrip />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="h-px w-8 bg-line" />
          {eyebrow}
        </span>
        <h2 className="font-serif text-balance text-4xl tracking-tight text-ink sm:text-5xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function FeatureSkeleton() {
  return (
    <>
      <div className="space-y-5 lg:col-span-3">
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-10 lg:col-span-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/3] rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

function NewsletterStrip() {
  const [email, setEmail] = useState('');
  return (
    <section className="my-20 overflow-hidden rounded-3xl border border-line bg-surface-2/60">
      <div className="grid gap-10 p-10 md:grid-cols-2 lg:p-16">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            <Sparkles className="size-3" strokeWidth={1.75} /> Subscribe
          </span>
          <h3 className="mt-4 font-serif text-balance text-4xl leading-[1.05] text-ink sm:text-5xl">
            One <span className="italic">considered</span> essay, every Thursday morning.
          </h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col justify-end gap-3"
        >
          <p className="text-sm text-muted">
            No tracking, no autoplay, no upsells. Unsubscribe whenever.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.com"
              className="h-12 flex-1 rounded-full border border-line bg-paper px-5 text-[15px] text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none"
            />
            <Button type="submit" size="lg">
              Subscribe
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
