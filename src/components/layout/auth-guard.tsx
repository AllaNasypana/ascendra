"use client";

import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Skeleton } from "@/components/ui";
import { ROUTES } from "@/constants";
import { UserRole, ERole} from "@/types";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard: FC<AuthGuardProps> = ({ children, allowedRoles}) => {
  const { user, isLoading,  } = useAuth();
  const router = useRouter(); 

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(ROUTES.login);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(
        user.role === ERole.ADMIN ? ROUTES.overview : ROUTES.machines
      );
    }
  }, [user, isLoading, allowedRoles, router]);


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-3 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }
  if (!user) {
    
    return null;
  }
 

  if (!!allowedRoles && user?.role &&!allowedRoles.includes(user.role)) {
    
    return null;
  }

  return <>{children}</>;
};
