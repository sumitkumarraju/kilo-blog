import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasRole, useAuthStore } from '@/lib/auth-store';
import type { Role } from '@/types/api';

interface Props {
  roles: Role[];
  children: ReactNode;
}

export function RequireRole({ roles, children }: Props) {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="container-page py-32 text-center text-sm text-muted">
        Checking access…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!hasRole(user, roles)) {
    return (
      <div className="container-page py-32 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          403
        </p>
        <h1 className="mt-3 font-serif text-4xl">Not your shelf.</h1>
        <p className="mt-3 text-muted">
          This page is reserved for {roles.join(', ').toLowerCase()}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
