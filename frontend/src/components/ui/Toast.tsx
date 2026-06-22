import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '@/lib/theme-store';

export function BrandToaster() {
  const theme = useThemeStore((s) => s.theme);
  return (
    <Toaster
      position="bottom-right"
      gutter={10}
      toastOptions={{
        duration: 3200,
        style: {
          background: theme === 'dark' ? '#15140f' : '#ffffff',
          color: theme === 'dark' ? '#F2EFE8' : '#0D0D0F',
          border: `1px solid ${theme === 'dark' ? '#26241F' : '#E8E2D6'}`,
          boxShadow: 'none',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '12px',
        },
        success: { iconTheme: { primary: '#FF5C28', secondary: '#fff' } },
        error: { iconTheme: { primary: '#FF5C28', secondary: '#fff' } },
      }}
    />
  );
}
