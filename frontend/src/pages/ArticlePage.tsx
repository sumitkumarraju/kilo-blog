import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bookmark, Link2, Share2, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePost, usePosts } from '@/hooks/use-posts';
import { useComments } from '@/hooks/use-comments';
import { ArticleHero } from '@/components/blog/ArticleHero';
import { CommentForm } from '@/components/blog/CommentForm';
import { CommentThread } from '@/components/blog/CommentThread';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug);
  const { comments, add } = useComments(post?.slug);
  const { data: related } = usePosts({
    size: 3,
    tag: post?.tags?.[0]?.slug,
    sort: 'newest',
  });

  useEffect(() => {
    if (post?.title) document.title = `${post.title} — Kilo`;
    return () => {
      document.title = 'Kilo — A reading-first journal';
    };
  }, [post]);

  if (error) {
    return (
      <div className="container-page py-32 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          404
        </p>
        <h1 className="mt-3 font-serif text-4xl">This story has wandered off.</h1>
        <p className="mt-3 text-muted">
          Try the{' '}
          <Link to="/articles" className="text-ink underline underline-offset-2">
            archive
          </Link>
          .
        </p>
      </div>
    );
  }

  if (loading || !post) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <Skeleton className="mx-auto h-4 w-24" />
          <Skeleton className="mx-auto h-16 w-3/4" />
          <Skeleton className="mx-auto h-6 w-1/2" />
        </div>
        <Skeleton className="mx-auto mt-12 aspect-[16/9] max-w-6xl rounded-2xl" />
      </div>
    );
  }

  const relatedPosts =
    related?.content.filter((p) => String(p.id) !== String(post.id)).slice(0, 2) ?? [];

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      toast.success('Link copied');
    });
  }

  return (
    <article className="pb-24">
      <ArticleHero post={post} />

      <div className="container-page mt-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-32 flex flex-col items-start gap-3">
              <ShareButton
                icon={<Link2 className="size-4" strokeWidth={1.75} />}
                label="Copy link"
                onClick={copyLink}
              />
              <ShareButton
                icon={<Twitter className="size-4" strokeWidth={1.75} />}
                label="Share on X"
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const text = encodeURIComponent(post.title);
                  window.open(
                    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                    '_blank',
                  );
                }}
              />
              <ShareButton
                icon={<Bookmark className="size-4" strokeWidth={1.75} />}
                label="Save"
                onClick={() => toast.success('Saved to your reading list')}
              />
              <ShareButton
                icon={<Share2 className="size-4" strokeWidth={1.75} />}
                label="Share"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: post.title,
                        url: window.location.href,
                      })
                      .catch(() => undefined);
                  } else {
                    copyLink();
                  }
                }}
              />
            </div>
          </aside>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="prose font-serif"
              dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
            />

            <div className="mt-16 flex flex-wrap items-center gap-2 border-t border-line pt-10">
              <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                Filed under
              </span>
              {post.tags?.map((t) => (
                <Tag key={t.id} tag={t} size="sm" />
              ))}
            </div>

            <section className="mt-20">
              <h2 className="font-serif text-3xl tracking-tight text-ink">
                Conversation
              </h2>
              <p className="mt-2 text-sm text-muted">
                Comments are reviewed by editors before they appear.
              </p>
              <div className="mt-8">
                <CommentForm onSubmit={add} />
              </div>
              <div className="mt-10">
                <CommentThread comments={comments} onReply={add} />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-32 space-y-4 text-sm">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                Writer
              </h4>
              <p className="font-serif text-lg text-ink">
                {post.author.displayName ?? post.author.email}
              </p>
              {post.author.bio && (
                <p className="text-muted">{post.author.bio}</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="container-page mt-32 border-t border-line pt-16">
          <div className="flex items-end justify-between">
            <h3 className="font-serif text-3xl tracking-tight text-ink">
              Continue reading
            </h3>
            <Link to="/articles">
              <Button variant="ghost" size="sm">
                More articles
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            {relatedPosts.map((p) => (
              <ArticleCard key={p.id} post={p} variant="default" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function ShareButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors duration-160 hover:border-ink"
    >
      {icon}
    </button>
  );
}
