import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Tag } from '@/types/api';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.tags
      .list()
      .then((r) => !cancelled && setTags(r))
      .catch(() => !cancelled && setTags([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { tags, loading };
}
