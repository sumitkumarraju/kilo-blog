import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, FileText, MessageSquare } from 'lucide-react';
import { useModeration } from '@/hooks/use-moderation';
import { ModerationStats } from '@/components/moderation/ModerationStats';
import { PendingPostRow } from '@/components/moderation/PendingPostRow';
import { PendingCommentRow } from '@/components/moderation/PendingCommentRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

type Tab = 'posts' | 'comments';

export function ModerationPage() {
  const {
    stats,
    pendingPosts,
    pendingComments,
    loading,
    approvePost,
    rejectPost,
    approveComment,
    rejectComment,
  } = useModeration();
  const [tab, setTab] = useState<Tab>('posts');

  const tabs = useMemo(
    () => [
      {
        id: 'posts' as const,
        label: 'Posts',
        icon: FileText,
        count: pendingPosts.length,
      },
      {
        id: 'comments' as const,
        label: 'Comments',
        icon: MessageSquare,
        count: pendingComments.length,
      },
    ],
    [pendingPosts.length, pendingComments.length],
  );

  return (
    <div className="container-page py-16">
      <header className="border-b border-line pb-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Editorial desk
        </span>
        <h1
          className="mt-3 font-serif text-balance leading-[0.95] tracking-tight text-ink"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 500 }}
        >
          Moderation.
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Review submitted posts, approve pending comments, and keep the issue
          on schedule.
        </p>
      </header>

      <div className="mt-10">
        {stats ? (
          <ModerationStats stats={stats} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        )}
      </div>

      <div className="mt-14 flex items-center gap-1 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative inline-flex h-11 cursor-pointer items-center gap-2 px-4 text-sm transition-colors duration-160 ${
              tab === t.id ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="mod-tab"
                transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-x-2 -bottom-px h-0.5 bg-ink"
              />
            )}
            <t.icon className="size-4" strokeWidth={1.75} />
            <span className="relative">{t.label}</span>
            <span className="rounded-full border border-line px-1.5 font-mono text-[10px] text-muted">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-3">
        <AnimatePresence mode="wait">
          {tab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            >
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-2xl" />
                  ))}
                </div>
              ) : pendingPosts.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="All clear."
                  description="No posts waiting for review right now."
                />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {pendingPosts.map((p) => (
                      <PendingPostRow
                        key={p.id}
                        post={p}
                        onApprove={approvePost}
                        onReject={rejectPost}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'comments' && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            >
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-2xl" />
                  ))}
                </div>
              ) : pendingComments.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="Inbox empty."
                  description="No pending comments. Take a walk."
                />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {pendingComments.map((c) => (
                      <PendingCommentRow
                        key={c.id}
                        comment={c}
                        onApprove={approveComment}
                        onReject={rejectComment}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
