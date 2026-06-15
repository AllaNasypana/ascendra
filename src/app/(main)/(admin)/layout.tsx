import type { ReactNode } from 'react';
import { AuthGuard, AppShell } from '@/components/layout';
import { ERole } from '@/types';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={[ERole.ADMIN]}>
        <AppShell variant={ERole.ADMIN}>
          {children}
        </AppShell>
        
    </AuthGuard>
  );
}
