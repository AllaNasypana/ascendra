'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list,
    queryFn: () => api.users.list(),
  });
}
