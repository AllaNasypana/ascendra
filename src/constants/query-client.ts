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
