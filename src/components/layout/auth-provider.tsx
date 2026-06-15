"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { PublicUser } from "@/types";
import { ERole } from "@/types";
import { ROUTES } from "@/constants";
import { api, authStorage } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: PublicUser["role"];
}

export interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  register: (payload: RegisterPayload) => void;
  logout: () => void;
  isLoginPending: boolean;
  isRegisterPending: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [sessionUser, setSessionUser] = useState<PublicUser | null>(null);
  const currentUser = useCurrentUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const setAuthUser = 
    (user: PublicUser) => {
      authStorage.setUserId(user.id);
      setSessionUser(user);
      queryClient.setQueryData(queryKeys.auth.me(user.id), { user });
    };

  const clearAuthUser = () => {
    authStorage.clear();
    setSessionUser(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
  };

  useEffect(() => {
    if (currentUser.isAuthReady && !authStorage.getUserId()) {
      setSessionUser(null);
    }
  }, [currentUser.isAuthReady, currentUser.data]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.login(email, password),
    onSuccess: ({ user }) => {
      setAuthUser(user);
      router.replace(user.role === ERole.ADMIN ? ROUTES.overview : ROUTES.machines);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      clearAuthUser();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.auth.register(
        payload.name,
        payload.email,
        payload.password,
        payload.role
      ),
    onSuccess: ({ user }) => {
      setAuthUser(user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list });
      router.replace(user.role === ERole.ADMIN ? ROUTES.overview : ROUTES.machines);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    },
  });

  const login = useCallback(
    (email: string, password: string) => {
      loginMutation.mutate({ email, password });
    },
    [loginMutation]
  );

  const register = useCallback(
    (payload: RegisterPayload) => {
      registerMutation.mutate(payload);
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    authStorage.clear();
    setSessionUser(null);
    queryClient.clear();
    router.replace(ROUTES.login);
  }, [queryClient, router]);

  const storedUserId = currentUser.isAuthReady ? authStorage.getUserId() : null;

  const user = storedUserId
    ? (sessionUser ?? currentUser.data ?? null)
    : null;
  const isLoading =
    !currentUser.isAuthReady ||
    currentUser.isLoading ||
    loginMutation.isPending ||
    registerMutation.isPending;

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      isLoginPending: loginMutation.isPending,
      isRegisterPending: registerMutation.isPending,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      loginMutation.isPending,
      registerMutation.isPending,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
