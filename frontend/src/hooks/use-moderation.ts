import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Comment, ModerationStats, Post } from '@/types/api';

export function useModeration() {
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [s, p, c] = await Promise.all([
        api.moderation.stats().catch(() => null),
        api.moderation.pendingPosts().catch(() => []),
        api.comments.pending().catch(() => []),
      ]);
      setStats(
        s ?? {
          pendingPosts: p.length,
          pendingComments: c.length,
          publishedPosts: 0,
          approvedComments: 0,
          totalPosts: 0,
          totalComments: 0,
        },
      );
      setPendingPosts(p);
      setPendingComments(c);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const approvePost = useCallback(
    async (id: string) => {
      await api.posts.approve(id);
      await reload();
    },
    [reload],
  );

  const rejectPost = useCallback(
    async (id: string, reason: string) => {
      await api.posts.reject(id, reason);
      await reload();
    },
    [reload],
  );

  const publishPost = useCallback(
    async (id: string) => {
      await api.posts.publish(id);
      await reload();
    },
    [reload],
  );

  const approveComment = useCallback(
    async (id: string) => {
      await api.comments.moderate(id, 'APPROVED');
      await reload();
    },
    [reload],
  );

  const rejectComment = useCallback(
    async (id: string) => {
      await api.comments.moderate(id, 'REJECTED');
      await reload();
    },
    [reload],
  );

  return {
    stats,
    pendingPosts,
    pendingComments,
    loading,
    reload,
    approvePost,
    rejectPost,
    publishPost,
    approveComment,
    rejectComment,
  };
}
