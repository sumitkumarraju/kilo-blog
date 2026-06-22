import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Command, FilePlus, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore, hasRole } from '@/lib/auth-store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface Props {
  onOpenCommandPalette: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/articles', label: 'Articles' },
];

export function Navbar({ onOpenCommandPalette }: Props) {
  const user = useAuthStore((s) => s.user);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 8));
  }, [scrollY]);

  const padding = useSpring(useTransform(scrollY, [0, 80], [20, 12]), {
    stiffness: 120,
    damping: 30,
  });

  const isAuthor = hasRole(user, ['AUTHOR', 'EDITOR', 'ADMIN']);
  const isModerator = hasRole(user, ['EDITOR', 'ADMIN']);

  return (
    <motion.header
      style={{ paddingTop: padding, paddingBottom: padding }}
      className={clsx(
        'sticky top-0 z-50 w-full transition-colors duration-200',
        scrolled
          ? 'glass border-b border-line'
          : 'border-b border-transparent',
      )}
    >
      <div className="container-page flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-ink text-paper">
            <span className="font-serif italic">K</span>
          </span>
          <span>Kilo</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'relative inline-flex h-9 cursor-pointer items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-160',
                  isActive ? 'text-ink' : 'text-muted hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute inset-0 rounded-full bg-surface-2"
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="ml-auto flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm text-muted transition-colors duration-160 hover:border-ink hover:text-ink"
        >
          <Command className="size-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />

        {isAuthor && (
          <Link
            to="/editor/new"
            className="hidden h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3.5 text-sm font-medium text-ink transition-colors duration-160 hover:border-ink sm:inline-flex"
          >
            <FilePlus className="size-3.5" strokeWidth={1.75} />
            Write
          </Link>
        )}

        {isModerator && (
          <Link
            to="/moderation"
            aria-label="Moderation"
            className={clsx(
              'hidden size-9 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors duration-160 hover:border-ink md:inline-flex',
              location.pathname.startsWith('/moderation') && 'border-ink',
            )}
          >
            <ShieldCheck className="size-4" strokeWidth={1.75} />
          </Link>
        )}

        {user ? (
          <Link
            to="/dashboard"
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-ink px-3.5 text-sm font-medium text-paper transition-opacity duration-160 hover:opacity-90"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider">
              {user.role}
            </span>
            <span className="hidden sm:inline">{user.displayName ?? user.email}</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-flex h-9 cursor-pointer items-center rounded-full bg-ink px-4 text-sm font-medium text-paper transition-opacity duration-160 hover:opacity-90"
          >
            Sign in
          </Link>
        )}
      </div>
    </motion.header>
  );
}
