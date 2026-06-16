export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: (userId: string | null) => ['auth', 'me', userId] as const,
  },
  users: {
    list: ['users'] as const,
  },
  vms: {
    all: ['vms'] as const,
    list: (params?: { ownerId?: string }) => ['vms', 'list', params ?? {}] as const,
    detail: (id: string) => ['vms', 'detail', id] as const,
    metrics: (id: string) => ['vms', 'metrics', id] as const,
  },
  templates: {
    list: ['templates'] as const,
    detail: (id: string) => ['templates', 'detail', id] as const,
  },
  fleet: {
    detail: (period?: string) => ['fleet', period ?? 'real-time'] as const,
  },
};
