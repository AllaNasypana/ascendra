'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/forms';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { DEMO_PASSWORD } from '@/constants/auth';
import { ROUTES } from '@/constants';
import { ERole } from '@/types';
import { useAuth } from '@/hooks';
import Link from 'next/link';

export const LoginPageView = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;
    router.replace(user.role === ERole.ADMIN ? ROUTES.overview : ROUTES.machines);
  }, [user, isLoading, router]);

  if (isLoading || user) return null;

  return (
    <Card className="auth-card w-full">
      <CardHeader className="text-center">
        <div className="auth-logo mx-auto mb-2" aria-hidden>
          A
        </div>
        <CardTitle className="text-2xl">Ascendra Workspaces</CardTitle>
        <CardDescription>Sign in to manage your developer machines</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />

        <div className="mt-6 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Demo accounts (password: {DEMO_PASSWORD})</p>
          <p className="mt-1">Developer: alex.chen@ascendra.io</p>
          <p>Admin: taylor.admin@ascendra.io</p>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          No account?{' '}
          <Link href="/registration" className="text-primary underline underline-offset-2">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
