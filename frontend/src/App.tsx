import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/theme-store';
import { useAuthStore } from '@/lib/auth-store';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { BrandToaster } from '@/components/ui/Toast';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { AppRoutes } from '@/routes';

export default function App() {
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    hydrateTheme();
    hydrateAuth();
  }, [hydrateTheme, hydrateAuth]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <ScrollProgress />
      <Navbar onOpenCommandPalette={() => setPaletteOpen(true)} />
      <div className="flex-1">
        <AppRoutes />
      </div>
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <BrandToaster />
    </div>
  );
}
