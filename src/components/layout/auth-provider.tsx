'use client';

import type { ReactNode } from 'react';
import { createContext,  useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { PublicUser } from '@/types';
import { api, authStorage } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { useCurrentUser } from '@/hooks/use-current-user';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: PublicUser['role'];
}

export interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<PublicUser | null>;
  register: (payload: RegisterPayload) => Promise<PublicUser | null>;
  logout: () => void;
  isLoginPending: boolean;
  isRegisterPending: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [sessionUser, setSessionUser] = useState<PublicUser | null>(null);

  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.login(email, password),
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.auth.register(payload.name, payload.email, payload.password, payload.role),
  });

  useEffect(() => {
    if (!currentUser.isAuthReady) return;

    const storedUserId = authStorage.getUserId();

    if (!storedUserId) {
      setSessionUser(null);
      return;
    }

    if (currentUser.data) {
      setSessionUser(currentUser.data);
    }
  }, [currentUser.isAuthReady, currentUser.data]);

  const setAuthUser = (user: PublicUser) => {
    authStorage.setUserId(user.id);
    setSessionUser(user);
    queryClient.setQueryData(queryKeys.auth.me(user.id), { user });
  };

  const clearAuthUser = () => {
    authStorage.clear();
    setSessionUser(null);
    queryClient.removeQueries({ queryKey: queryKeys.auth.all });
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await loginMutation.mutateAsync({ email, password });

      setAuthUser(user);

      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';

      clearAuthUser();
      toast.error(message);

      return null;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const { user } = await registerMutation.mutateAsync(payload);

      setAuthUser(user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list });

      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';

      toast.error(message);

      return null;
    }
  };

  const logout = () => {
    clearAuthUser();
    queryClient.clear();
  };

  const storedUserId = currentUser.isAuthReady ? authStorage.getUserId() : null;
  const user = storedUserId ? (sessionUser ?? currentUser.data ?? null) : null;

  const isLoading =
    !currentUser.isAuthReady ||
    currentUser.isLoading ||
    loginMutation.isPending ||
    registerMutation.isPending;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      isLoginPending: loginMutation.isPending,
      isRegisterPending: registerMutation.isPending,
    }),
    [user, isLoading, loginMutation.isPending, registerMutation.isPending],
  );
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
