import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { PageResponse, Post, PostListParams } from '@/types/api';

export function usePosts(params: PostListParams = {}) {
  const [data, setData] = useState<PageResponse<Post> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const key = JSON.stringify(params);

  const reload = useCallback(() => {
    setLoading(true);
    api.posts
      .list(params)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      .then((res) => setData(res))
      .catch((e) => setError(e as Error))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}

export function usePost(slug: string | undefined) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.posts
      .bySlug(slug)
      .then(setPost)
      .catch((e) => setError(e as Error))
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading, error };
}

export function useFeaturedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.posts
      .featured()
      .then((r) => !cancelled && setPosts(r))
      .catch(() => {
        // graceful fallback: list query
        api.posts
          .list({ size: 4, sort: 'newest' })
          .then((p) => !cancelled && setPosts(p.content))
          .catch(() => undefined);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading };
}
