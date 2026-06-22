import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Tag } from '@/components/ui/Tag';
import { PostMeta } from './PostMeta';
import type { Post } from '@/types/api';

interface Props {
  post: Post;
}

export function ArticleHero({ post }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.6, 0.2]);

  return (
    <header ref={ref} className="relative">
      <div className="container-page pt-10 lg:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {post.tags?.slice(0, 3).map((t) => (
              <Tag key={t.id} tag={t} size="sm" />
            ))}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 font-serif text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.98] tracking-tightest text-ink"
          >
            {post.title}
          </motion.h1>
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted"
            >
              {post.excerpt}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-8 flex justify-center"
          >
            <PostMeta post={post} />
          </motion.div>
        </div>
      </div>

      {post.coverImageUrl && (
        <div className="container-page mt-12">
          <motion.div
            style={{ y, opacity }}
            className="relative mx-auto aspect-[16/9] max-w-6xl overflow-hidden rounded-2xl border border-line bg-surface-2"
          >
            <motion.img
              layoutId={`cover-${post.id}`}
              src={post.coverImageUrl}
              alt=""
              className="size-full object-cover"
            />
          </motion.div>
        </div>
      )}
    </header>
  );
}
