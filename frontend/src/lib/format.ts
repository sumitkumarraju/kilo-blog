import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';

export function fmtDate(value?: string | null, pattern = 'MMM d, yyyy') {
  if (!value) return '';
  try {
    return format(parseISO(value), pattern);
  } catch {
    return '';
  }
}

export function fmtRelative(value?: string | null) {
  if (!value) return '';
  try {
    return `${formatDistanceToNowStrict(parseISO(value))} ago`;
  } catch {
    return '';
  }
}

export function readingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function initials(nameOrEmail?: string): string {
  if (!nameOrEmail) return '·';
  const cleaned = nameOrEmail.split('@')[0];
  const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

export function pluralize(n: number, one: string, many?: string) {
  return `${n} ${n === 1 ? one : many ?? `${one}s`}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export function compactExcerpt(html: string, max = 180): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}
