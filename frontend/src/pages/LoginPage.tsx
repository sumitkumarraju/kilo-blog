import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Wand2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LocState {
  from?: string;
}

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@kilo.blog');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      const dest = (location.state as LocState | null)?.from ?? '/';
      navigate(dest, { replace: true });
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setBusy(false);
    }
  }

  async function demoLogin() {
    setBusy(true);
    try {
      await login('admin@kilo.blog', 'Admin123!');
      toast.success('Signed in as the demo admin');
      navigate('/', { replace: true });
    } catch {
      toast.error('Demo login is only available when the backend is seeded');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Sign in
          </span>
          <h1 className="mt-3 font-serif text-balance text-5xl leading-[0.95] tracking-tight text-ink">
            Welcome back to the desk.
          </h1>
          <p className="mt-4 text-muted">
            Sign in to write, comment, and access the editorial desk.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth loading={busy} size="lg">
              Sign in
            </Button>
          </form>

          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={demoLogin}
              disabled={busy}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-line py-2.5 text-sm text-muted transition-colors duration-160 hover:border-ink hover:text-ink"
            >
              <Wand2 className="size-3.5" strokeWidth={1.75} />
              Demo as Admin
            </button>
          )}

          <p className="mt-8 text-sm text-muted">
            New here?{' '}
            <Link to="/register" className="text-ink underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      <aside className="hidden border-l border-line bg-surface-2/40 lg:flex lg:items-center lg:justify-center">
        <figure className="max-w-md px-10 py-16">
          <blockquote className="font-serif text-balance text-3xl leading-snug text-ink">
            <span className="text-accent">“</span>The internet rewards the
            <em> hurried</em>. Kilo is a quiet space for the people who refuse.
            <span className="text-accent">”</span>
          </blockquote>
          <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            From the editor's note — Issue 06
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
