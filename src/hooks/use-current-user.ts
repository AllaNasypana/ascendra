'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, authStorage } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

export const useCurrentUser = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  const userId = isAuthReady ? authStorage.getUserId() : null;

  const query = useQuery({
    queryKey: queryKeys.auth.me(userId),
    queryFn: () => api.auth.me(userId ?? ''),
    enabled: isAuthReady && Boolean(userId),
    select: (data) => data.user,
  });

  return {
    ...query,
    isAuthReady,
  };
};
