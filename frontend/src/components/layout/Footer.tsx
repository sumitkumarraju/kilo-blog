import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-paper">
      <div className="container-page py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight">
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-ink text-paper">
                <span className="font-serif italic">K</span>
              </span>
              <span>Kilo</span>
            </div>
            <p className="mt-5 max-w-md font-serif text-2xl italic leading-snug text-ink">
              A quiet corner of the internet for considered writing.
            </p>
            <p className="mt-4 max-w-md text-sm text-muted">
              Edited weekly. Long-form essays, interviews, and field notes
              from people building thoughtful things.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Read
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/articles" className="text-ink underline-grow">
                  All articles
                </Link>
              </li>
              <li>
                <Link to="/tag/essays" className="text-ink underline-grow">
                  Essays
                </Link>
              </li>
              <li>
                <Link to="/tag/interviews" className="text-ink underline-grow">
                  Interviews
                </Link>
              </li>
              <li>
                <Link to="/tag/notes" className="text-ink underline-grow">
                  Field notes
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Write
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/editor/new" className="text-ink underline-grow">
                  New post
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-ink underline-grow">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/moderation" className="text-ink underline-grow">
                  Moderation
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Elsewhere
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-ink underline-grow"
                >
                  Twitter <ArrowUpRight className="size-3" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-ink underline-grow"
                >
                  RSS <ArrowUpRight className="size-3" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-ink underline-grow"
                >
                  Are.na <ArrowUpRight className="size-3" strokeWidth={1.5} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            © {new Date().getFullYear()} Kilo Journal · Issue 06
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Set in Fraunces, Inter and JetBrains Mono.
          </p>
        </div>
      </div>
    </footer>
  );
}
