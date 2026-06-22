import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, MessageSquare, Library, type LucideIcon } from 'lucide-react';
import type { ModerationStats as Stats } from '@/types/api';

interface Props {
  stats: Stats;
}

export function ModerationStats({ stats }: Props) {
  const items = [
    {
      label: 'Pending posts',
      value: stats.pendingPosts,
      icon: FileText,
      tone: 'accent' as const,
    },
    {
      label: 'Pending comments',
      value: stats.pendingComments,
      icon: MessageSquare,
      tone: 'muted' as const,
    },
    {
      label: 'Published',
      value: stats.publishedPosts,
      icon: CheckCircle2,
      tone: 'muted' as const,
    },
    {
      label: 'Library size',
      value: stats.totalPosts,
      icon: Library,
      tone: 'muted' as const,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          icon={item.icon}
          tone={item.tone}
          delay={i * 0.06}
        />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  delay,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: 'accent' | 'muted';
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-2xl border border-line bg-paper p-5"
    >
      <div className="flex items-start justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {label}
        </p>
        <Icon
          className={
            tone === 'accent'
              ? 'size-4 text-accent'
              : 'size-4 text-muted'
          }
          strokeWidth={1.5}
        />
      </div>
      <p className="mt-6 font-serif text-5xl font-medium leading-none tracking-tightest text-ink">
        {display}
      </p>
    </motion.div>
  );
}
