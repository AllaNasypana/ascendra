'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { PublicUser } from '@/types';
import type { AuthContextValue, RegisterPayload } from '@/types/auth';
import { api, authStorage } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getErrorMessage } from '@/utils/errors';

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
      clearAuthUser();
      toast.error(getErrorMessage(error, 'Login failed'));
      return null;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const { user } = await registerMutation.mutateAsync(payload);
      setAuthUser(user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      return user;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registration failed'));
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

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    register,
    logout,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
