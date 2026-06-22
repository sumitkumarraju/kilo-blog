import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/lib/theme-store';

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors duration-160 hover:border-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -45, scale: 0.95 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex"
          >
            <Sun className="size-4" strokeWidth={1.5} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 45, scale: 0.95 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex"
          >
            <Moon className="size-4" strokeWidth={1.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
