import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  CornerDownLeft,
  FileText,
  Hash,
  LayoutDashboard,
  PenLine,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Post } from '@/types/api';
import { hasRole, useAuthStore } from '@/lib/auth-store';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Item {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Search;
  onSelect: () => void;
  group: 'navigate' | 'posts';
}

export function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // focus on open
  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  // search
  useEffect(() => {
    if (!open) return;
    const handle = setTimeout(async () => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      try {
        const page = await api.posts.list({ q, size: 6 });
        setResults(page.content);
      } catch {
        setResults([]);
      }
    }, 160);
    return () => clearTimeout(handle);
  }, [q, open]);

  const navigationItems: Item[] = useMemo(() => {
    const items: Item[] = [
      {
        id: 'home',
        label: 'Home',
        hint: 'Latest issue',
        icon: LayoutDashboard,
        group: 'navigate',
        onSelect: () => navigate('/'),
      },
      {
        id: 'articles',
        label: 'All articles',
        icon: FileText,
        group: 'navigate',
        onSelect: () => navigate('/articles'),
      },
    ];
    if (user) {
      items.push({
        id: 'editor',
        label: 'Write a new post',
        icon: PenLine,
        group: 'navigate',
        onSelect: () => navigate('/editor/new'),
      });
      items.push({
        id: 'dashboard',
        label: 'My dashboard',
        icon: LayoutDashboard,
        group: 'navigate',
        onSelect: () => navigate('/dashboard'),
      });
    }
    if (hasRole(user, ['EDITOR', 'ADMIN'])) {
      items.push({
        id: 'mod',
        label: 'Moderation queue',
        icon: ShieldCheck,
        group: 'navigate',
        onSelect: () => navigate('/moderation'),
      });
    }
    return items;
  }, [navigate, user]);

  const postItems: Item[] = useMemo(
    () =>
      results.map((p) => ({
        id: `p-${p.id}`,
        label: p.title,
        hint: p.tags?.[0]?.name,
        icon: Hash,
        group: 'posts' as const,
        onSelect: () => navigate(`/article/${p.slug}`),
      })),
    [results, navigate],
  );

  const items: Item[] = q.trim()
    ? [...postItems, ...navigationItems]
    : navigationItems;

  useEffect(() => {
    setActive(0);
  }, [items.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(items.length - 1, a + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = items[active];
        if (item) {
          item.onSelect();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items, active, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/40 px-4 pt-24 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-paper"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search className="size-4 text-muted" strokeWidth={1.75} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search posts, jump anywhere…"
                className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/70 focus:outline-none"
              />
              <kbd className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {items.length === 0 ? (
                <div className="px-3 py-12 text-center text-sm text-muted">
                  No matches. Try a different keyword.
                </div>
              ) : (
                <>
                  {q.trim() && postItems.length > 0 && (
                    <SectionLabel>Articles</SectionLabel>
                  )}
                  {q.trim() &&
                    postItems.map((item, i) => (
                      <Row
                        key={item.id}
                        item={item}
                        active={active === i}
                        onSelect={() => {
                          item.onSelect();
                          onClose();
                        }}
                        onHover={() => setActive(i)}
                      />
                    ))}
                  {q.trim() && postItems.length > 0 && (
                    <div className="my-2 h-px bg-line" />
                  )}
                  <SectionLabel>Navigate</SectionLabel>
                  {navigationItems.map((item, j) => {
                    const idx = q.trim() ? postItems.length + j : j;
                    return (
                      <Row
                        key={item.id}
                        item={item}
                        active={active === idx}
                        onSelect={() => {
                          item.onSelect();
                          onClose();
                        }}
                        onHover={() => setActive(idx)}
                      />
                    );
                  })}
                </>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line bg-surface-2/60 px-4 py-2.5 text-[11px] text-muted">
              <span className="flex items-center gap-3">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeft className="size-2.5" />
                </Kbd>
                <span>open</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
      {children}
    </div>
  );
}

function Row({
  item,
  active,
  onSelect,
  onHover,
}: {
  item: Item;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-160 ${
        active ? 'bg-surface-2' : 'hover:bg-surface-2/60'
      }`}
    >
      <span className="inline-flex size-7 items-center justify-center rounded-md border border-line text-ink">
        <item.icon className="size-3.5" strokeWidth={1.75} />
      </span>
      <span className="flex-1 truncate text-[14px] text-ink">{item.label}</span>
      {item.hint && (
        <span className="text-[11px] text-muted">{item.hint}</span>
      )}
      <ArrowRight
        className={`size-3.5 transition-opacity duration-160 ${
          active ? 'text-ink opacity-100' : 'opacity-0'
        }`}
        strokeWidth={1.75}
      />
    </button>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-muted">
      {children}
    </kbd>
  );
}
