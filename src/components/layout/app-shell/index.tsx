'use client';

import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { cn } from '@/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';
import type { UserRole } from '@/types';
import { ERole } from '@/types';
import { Sidebar } from './sidebar';
import { ROUTES } from '@/constants';
interface AppShellProps {
  children: ReactNode;
  variant?: UserRole;
}

export const AppShell: FC<AppShellProps> = ({ children, variant }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen((isOpen) => !isOpen);
  };

  const handleLogout = () => {
    logout();
    closeMobileSidebar();
    router.replace(ROUTES.login);
    router.refresh();
  };

  const shellTitle = variant === ERole.ADMIN ? 'Admin Console' : 'Workspaces';

  return (
    <div className="app-shell" data-variant={variant}>
      {mobileOpen && (
        <button
          type="button"
          className="app-shell-mobile-overlay md:hidden"
          aria-label="Close navigation menu"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={cn('app-shell-sidebar app-shell-sidebar-mobile md:static md:translate-x-0')}
        data-open={mobileOpen}
        aria-label="Sidebar"
      >
        <Sidebar
          variant={variant}
          pathname={pathname}
          user={user}
          logout={handleLogout}
          onNavigate={closeMobileSidebar}
        />
      </aside>

      <div className="app-shell-main">
        <header className="app-shell-mobile-header">
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={toggleMobileSidebar}
          >
            {mobileOpen ? <FiX aria-hidden /> : <FiMenu aria-hidden />}
          </Button>
          <span className="text-sm font-semibold">{shellTitle}</span>
        </header>

        <div className="app-shell-content">{children}</div>
      </div>
    </div>
  );
};
