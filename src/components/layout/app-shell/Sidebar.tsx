'use client';

import type { FC, ReactNode } from 'react';

import Link from 'next/link';
import { FiLogOut, FiMonitor, FiServer, FiGrid, FiLayers } from 'react-icons/fi';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';
import { ThemeToggle } from '../theme-toggle';
import { ERole, type UserRole } from '@/types';
import { ROUTES } from '@/constants';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const developerNav: NavItem[] = [
  { href: ROUTES.machines, label: 'My Machines', icon: <FiMonitor aria-hidden /> },
];

const adminNav: NavItem[] = [
  { href: ROUTES.overview, label: 'Fleet Overview', icon: <FiGrid aria-hidden /> },
  { href: ROUTES.inventory, label: 'VM Inventory', icon: <FiServer aria-hidden /> },
  { href: ROUTES.templates, label: 'Templates', icon: <FiLayers aria-hidden /> },
];

interface SidebarProps {
  variant?: UserRole;
  pathname: string;
  user: ReturnType<typeof useAuth>['user'];
  logout: () => void;
  onNavigate?: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ variant, pathname, user, logout, onNavigate }) => {
  const nav = variant === ERole.ADMIN ? adminNav : developerNav;
  const isAdmin = user?.role === ERole.ADMIN;
  const isAdminVariant = variant === ERole.ADMIN;

  return (
    <>
      <div className="app-shell-brand">
        <div className="app-shell-logo" aria-hidden>
          A
        </div>
        <div>
          <p className="text-sm font-semibold">Ascendra</p>
          <p className="app-shell-sidebar-muted text-xs">
            {isAdmin ? 'Admin Console' : 'Workspaces'}
          </p>
        </div>
      </div>

      <nav className="app-shell-nav" aria-label="Main navigation">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
            className="app-shell-nav-link"
            onClick={onNavigate}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="app-shell-footer">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="app-shell-sidebar-muted text-xs">{user?.email}</p>
        </div>

        <ThemeToggle />

        {isAdmin && !isAdminVariant && (
          <Link href={ROUTES.overview} className="mb-2 mt-2 block" onClick={onNavigate}>
            <Button variant="outline" size="sm" className="btn-shell-outline w-full">
              Switch to Admin
            </Button>
          </Link>
        )}
        {isAdmin && isAdminVariant && (
          <Link href={ROUTES.machines} className="mb-2 mt-2 block" onClick={onNavigate}>
            <Button variant="outline" size="sm" className="btn-shell-outline w-full">
              Developer View
            </Button>
          </Link>
        )}
        <Button variant="ghost" size="sm" className="btn-shell mt-2" onClick={logout}>
          <FiLogOut aria-hidden />
          Sign out
        </Button>
      </div>
    </>
  );
};
