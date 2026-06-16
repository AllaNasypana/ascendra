import { QueryClient } from '@tanstack/react-query';

export const makeQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchInterval: 30_000,
        retry: 1,
      },
    },
  });

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: (userId: string | null) => ['auth', 'me', userId] as const,
  },
  users: {
    all: ['users'] as const,
    list: ['users', 'list'] as const,
  },
  vms: {
    all: ['vms'] as const,
    list: (params?: { ownerId?: string }) => ['vms', 'list', params ?? {}] as const,
    detail: (id: string) => ['vms', 'detail', id] as const,
    metrics: (id: string) => ['vms', 'metrics', id] as const,
  },
  templates: {
    all: ['templates'] as const,
    list: ['templates', 'list'] as const,
    detail: (id: string) => ['templates', 'detail', id] as const,
  },
  fleet: {
    all: ['fleet'] as const,
    detail: (period?: string) => ['fleet', period ?? 'real-time'] as const,
  },
};
