'use client';

import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { Skeleton } from '@/components/ui';
import { ROUTES } from '@/constants';
import { UserRole } from '@/types';
import { getRoleRedirectPath } from '@/utils';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard: FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const isUnauthorizedRole =
    Boolean(user) && Boolean(allowedRoles) && !allowedRoles?.includes(user!.role);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(ROUTES.login);
      return;
    }

    if (isUnauthorizedRole) {
      router.replace(getRoleRedirectPath(user.role));
    }
  }, [user, isLoading, isUnauthorizedRole, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-64 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!user || isUnauthorizedRole) {
    return null;
  }

  return <>{children}</>;
};
