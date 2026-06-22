export type Role = 'READER' | 'AUTHOR' | 'EDITOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  description?: string | null;
  postCount?: number;
}

export type PostStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string;
  coverImageUrl?: string | null;
  status: PostStatus;
  author: User;
  tags: Tag[];
  readingTimeMinutes?: number;
  viewCount?: number;
  publishedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';

export interface Comment {
  id: string;
  postId: string;
  parentId?: string | null;
  author: User | null;
  guestName?: string | null;
  content: string;
  status: CommentStatus;
  createdAt: string;
  moderatedAt?: string | null;
  replies?: Comment[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface PostListParams {
  page?: number;
  size?: number;
  tag?: string;
  q?: string;
  sort?: 'newest' | 'oldest' | 'popular';
}

export interface ModerationStats {
  pendingPosts: number;
  pendingComments: number;
  publishedPosts: number;
  approvedComments: number;
  totalPosts: number;
  totalComments: number;
}

export interface CreatePostInput {
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  tagSlugs: string[];
}

export interface UpdatePostInput {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  tagSlugs?: string[];
}

export interface CreateCommentInput {
  content: string;
  parentId?: string | null;
  guestName?: string;
  guestEmail?: string;
}
