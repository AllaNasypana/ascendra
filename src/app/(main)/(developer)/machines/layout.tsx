import type { ReactNode } from 'react';
import { AuthGuard, AppShell } from '@/components/layout';


export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
        <AppShell>
          {children}
        </AppShell>
    </AuthGuard>
  );
}
