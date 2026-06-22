import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Comment, CreateCommentInput } from '@/types/api';

export function useComments(slug: string | undefined) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(Boolean(slug));

  const reload = useCallback(() => {
    if (!slug) return;
    setLoading(true);
    api.comments
      .forPost(slug)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = useCallback(
    async (body: CreateCommentInput) => {
      if (!slug) return;
      const created = await api.comments.create(slug, body);
      setComments((prev) => [created, ...prev]);
      return created;
    },
    [slug],
  );

  return { comments, loading, reload, add };
}
