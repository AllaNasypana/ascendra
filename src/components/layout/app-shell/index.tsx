"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {  FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/utils";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks";
import { UserRole, ERole } from "@/types";
import { Sidebar } from "./Sidebar";


interface AppShellProps {
  children: ReactNode;
  variant?: UserRole;
}

export const AppShell: FC<AppShellProps> = ({ children, variant }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell" data-variant={variant}>
      {mobileOpen && (
        <button
          type="button"
          className="app-shell-mobile-overlay md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn("app-shell-sidebar app-shell-sidebar-mobile md:static md:translate-x-0")}
        data-open={mobileOpen}
        aria-label="Sidebar"
      >
        <Sidebar
          variant={variant}
          pathname={pathname}
          user={user}
          logout={logout}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      <div className="app-shell-main">
        <header className="app-shell-mobile-header">
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <FiX aria-hidden /> : <FiMenu aria-hidden />}
          </Button>
          <span className="text-sm font-semibold">
            {variant === ERole.ADMIN ? "Admin Console" : "Workspaces"}
          </span>
        </header>

        <div className="app-shell-content">{children}</div>
      </div>
    </div>
  );
};
