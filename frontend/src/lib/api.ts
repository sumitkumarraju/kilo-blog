import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  AuthResponse,
  Comment,
  CommentStatus,
  CreateCommentInput,
  CreatePostInput,
  ModerationStats,
  PageResponse,
  Post,
  PostListParams,
  Tag,
  UpdatePostInput,
  User,
} from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const STORAGE_TOKEN_KEY = 'kilo.token';

export const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

client.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

function unwrap<T>(p: Promise<{ data: T }>): Promise<T> {
  return p.then((r) => r.data);
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      unwrap<AuthResponse>(client.post('/api/auth/login', { email, password })),
    register: (input: {
      email: string;
      password: string;
      displayName: string;
    }) => unwrap<AuthResponse>(client.post('/api/auth/register', input)),
    me: () => unwrap<User>(client.get('/api/auth/me')),
  },
  posts: {
    list: (params: PostListParams = {}) =>
      unwrap<PageResponse<Post>>(client.get('/api/posts', { params })),
    featured: () => unwrap<Post[]>(client.get('/api/posts/featured')),
    bySlug: (slug: string) =>
      unwrap<Post>(client.get(`/api/posts/${encodeURIComponent(slug)}`)),
    byId: (id: string) => unwrap<Post>(client.get(`/api/posts/id/${id}`)),
    mine: (params: { page?: number; size?: number } = {}) =>
      unwrap<PageResponse<Post>>(client.get('/api/posts/me/drafts', { params })),
    create: (body: CreatePostInput) => unwrap<Post>(client.post('/api/posts', body)),
    update: (slug: string, body: UpdatePostInput) =>
      unwrap<Post>(client.put(`/api/posts/${encodeURIComponent(slug)}`, body)),
    delete: (slug: string) =>
      unwrap<void>(client.delete(`/api/posts/${encodeURIComponent(slug)}`)),
    submit: (id: string) =>
      unwrap<Post>(client.post(`/api/posts/${id}/submit`)),
    approve: (id: string) =>
      unwrap<Post>(client.post(`/api/posts/${id}/approve`)),
    reject: (id: string, reason: string) =>
      unwrap<Post>(client.post(`/api/posts/${id}/reject`, { reason })),
    publish: (id: string) =>
      unwrap<Post>(client.post(`/api/posts/${id}/publish`)),
  },
  tags: {
    list: () => unwrap<Tag[]>(client.get('/api/tags')),
    popular: () => unwrap<Tag[]>(client.get('/api/tags/popular')),
    bySlug: (slug: string) =>
      unwrap<Tag>(client.get(`/api/tags/${encodeURIComponent(slug)}`)),
  },
  comments: {
    forPost: (slug: string) =>
      unwrap<Comment[]>(
        client.get(`/api/posts/${encodeURIComponent(slug)}/comments`),
      ),
    create: (slug: string, body: CreateCommentInput) =>
      unwrap<Comment>(
        client.post(`/api/posts/${encodeURIComponent(slug)}/comments`, body),
      ),
    moderate: (id: string, status: CommentStatus, reason?: string) =>
      unwrap<Comment>(
        client.put(`/api/comments/${id}/moderate`, { status, reason }),
      ),
    pending: () =>
      unwrap<PageResponse<Comment>>(
        client.get('/api/comments/moderation/queue'),
      ).then((p) => p.content),
  },
  moderation: {
    stats: () => unwrap<ModerationStats>(client.get('/api/moderation/stats')),
    pendingPosts: () =>
      unwrap<PageResponse<Post>>(
        client.get('/api/posts/moderation/queue'),
      ).then((p) => p.content),
  },
};

export { STORAGE_TOKEN_KEY };
