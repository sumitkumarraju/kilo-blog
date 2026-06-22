import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="container-page py-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          404 — Page not found
        </span>
        <h1
          className="mt-6 font-serif text-balance leading-[0.95] tracking-tight text-ink"
          style={{ fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 500 }}
        >
          This page has{' '}
          <span className="italic">wandered</span> off.
        </h1>
        <p className="mt-6 text-lg text-muted">
          The URL might be outdated, or the page may have been moved during a
          recent edit.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/">
            <Button size="lg">
              Back to home
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Button>
          </Link>
          <Link to="/articles">
            <Button size="lg" variant="outline">
              Browse archive
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
