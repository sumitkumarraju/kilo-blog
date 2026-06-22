import { create } from 'zustand';

type Theme = 'light' | 'dark';
const KEY = 'kilo.theme';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  set: (t: Theme) => void;
  hydrate: () => void;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.colorScheme = theme;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggle: () =>
    set((s) => {
      const next: Theme = s.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(KEY, next);
      applyTheme(next);
      return { theme: next };
    }),
  set: (t) => {
    localStorage.setItem(KEY, t);
    applyTheme(t);
    set({ theme: t });
  },
  hydrate: () => {
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? null;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const theme: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
    set({ theme });
  },
}));
