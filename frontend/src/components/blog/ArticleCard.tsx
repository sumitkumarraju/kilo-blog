import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import clsx from 'clsx';
import type { Post } from '@/types/api';
import { compactExcerpt, fmtDate, initials } from '@/lib/format';
import { childFadeUp } from '@/lib/motion-presets';

type Variant = 'featured' | 'default' | 'compact' | 'wide';

interface Props {
  post: Post;
  variant?: Variant;
  index?: number;
}

export function ArticleCard({ post, variant = 'default', index = 0 }: Props) {
  const to = `/article/${post.slug}`;
  const author = post.author;
  const tag = post.tags?.[0];

  if (variant === 'featured') {
    return (
      <motion.article variants={childFadeUp} className="group relative">
        <Link to={to} className="block">
          {post.coverImageUrl && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface-2">
              <motion.img
                layoutId={`cover-${post.id}`}
                src={post.coverImageUrl}
                alt=""
                className="size-full object-cover transition-transform duration-700 ease-out-strong group-hover:scale-[1.03]"
                loading="lazy"
              />
              {tag && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink backdrop-blur-sm">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: tag.color ?? 'var(--color-accent)' }}
                  />
                  {tag.name}
                </span>
              )}
            </div>
          )}
          <div className="mt-6 max-w-3xl">
            <h2 className="font-serif text-3xl leading-[1.05] tracking-tight text-ink transition-colors duration-200 group-hover:text-accent sm:text-4xl lg:text-5xl">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-4 max-w-prose text-base text-muted">
                {compactExcerpt(post.excerpt, 200)}
              </p>
            )}
            <Meta post={post} className="mt-5" />
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.article variants={childFadeUp} className="group flex items-start gap-4">
        <Link to={to} className="flex w-full items-start gap-4">
          <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1">
            <h3 className="font-serif text-lg leading-snug text-ink transition-colors duration-200 group-hover:text-accent sm:text-xl">
              {post.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
              <span>{author.displayName ?? author.email}</span>
              <span className="opacity-50">·</span>
              <span>{fmtDate(post.publishedAt ?? post.createdAt)}</span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === 'wide') {
    return (
      <motion.article variants={childFadeUp} className="group">
        <Link
          to={to}
          className="grid grid-cols-1 gap-8 border-t border-line py-10 md:grid-cols-12"
        >
          <div className="md:col-span-4">
            {post.coverImageUrl ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-2">
                <img
                  src={post.coverImageUrl}
                  alt=""
                  className="size-full object-cover transition-transform duration-700 ease-out-strong group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-xl bg-surface-2" />
            )}
          </div>
          <div className="md:col-span-8 md:pl-6">
            {tag && (
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
                {tag.name}
              </span>
            )}
            <h3 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-ink transition-colors duration-200 group-hover:text-accent sm:text-4xl">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-4 max-w-prose text-muted">{compactExcerpt(post.excerpt, 200)}</p>
            )}
            <Meta post={post} className="mt-6" />
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article variants={childFadeUp} className="group flex flex-col">
      <Link to={to} className="flex flex-1 flex-col">
        {post.coverImageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-surface-2">
            <motion.img
              layoutId={`cover-${post.id}`}
              src={post.coverImageUrl}
              alt=""
              className="size-full object-cover transition-transform duration-700 ease-out-strong group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] rounded-xl border border-line bg-surface-2" />
        )}
        <div className="mt-5 flex flex-1 flex-col">
          {tag && (
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
              {tag.name}
            </span>
          )}
          <h3 className="mt-2 font-serif text-2xl leading-tight tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-3 text-sm text-muted line-clamp-3">
              {compactExcerpt(post.excerpt, 140)}
            </p>
          )}
          <div className="mt-auto pt-5">
            <Meta post={post} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function Meta({ post, className }: { post: Post; className?: string }) {
  const author = post.author;
  const name = author.displayName ?? author.email;
  return (
    <div className={clsx('flex items-center gap-3 text-sm text-muted', className)}>
      {author.avatarUrl ? (
        <img
          src={author.avatarUrl}
          alt={name}
          className="size-7 rounded-full object-cover"
        />
      ) : (
        <span className="inline-flex size-7 items-center justify-center rounded-full border border-line bg-surface-2 font-mono text-[10px] uppercase text-ink">
          {initials(name)}
        </span>
      )}
      <span className="text-ink">{name}</span>
      <span className="opacity-50">·</span>
      <span className="font-mono text-[12px] uppercase tracking-[0.06em]">
        {fmtDate(post.publishedAt ?? post.createdAt)}
      </span>
      {post.readingTimeMinutes ? (
        <>
          <span className="opacity-50">·</span>
          <span className="font-mono text-[12px] uppercase tracking-[0.06em]">
            {post.readingTimeMinutes} min
          </span>
        </>
      ) : null}
    </div>
  );
}
