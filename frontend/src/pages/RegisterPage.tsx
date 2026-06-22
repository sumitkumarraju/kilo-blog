import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form);
      toast.success('Welcome to Kilo');
      navigate('/', { replace: true });
    } catch {
      toast.error('That email may already be taken');
    } finally {
      setBusy(false);
    }
  }

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));
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
            Create account
          </span>
          <h1 className="mt-3 font-serif text-balance text-5xl leading-[0.95] tracking-tight text-ink">
            Bring a pen.
          </h1>
          <p className="mt-4 text-muted">
            Sign up to comment, draft posts, and follow editors.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-4">
            <Input
              label="Display name"
              required
              value={form.displayName}
              onChange={field('displayName')}
              placeholder="Ada Lovelace"
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={field('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={field('password')}
              hint="At least 8 characters"
            />
            <Button type="submit" fullWidth size="lg" loading={busy}>
              Create account
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted">
            Already a reader?{' '}
            <Link to="/login" className="text-ink underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      <aside className="hidden border-l border-line bg-surface-2/40 lg:flex lg:items-center lg:justify-center">
        <figure className="max-w-md px-10 py-16">
          <blockquote className="font-serif text-balance text-3xl leading-snug text-ink">
            <span className="text-accent">“</span>I am still learning to say less.
            Kilo is the only place where editors thank me when I do.<span className="text-accent">”</span>
          </blockquote>
          <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            A contributing writer
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
