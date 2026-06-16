import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api-client';
import { isTransitionStatus } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useUserMachines = () => {
  const { user } = useAuth();

  const {
    data: vmsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['vms', user?.id],
    queryFn: () => api.vms.list({ ownerId: user!.id }),
    enabled: !!user,
    refetchInterval: (query) => {
      const vms = query.state.data?.vms ?? [];
      const hasTransition = vms.some((v) => isTransitionStatus(v.status));
      return hasTransition ? 2000 : 30000;
    },
  });

  const { data: templatesData } = useQuery({
    queryKey: ['templates'],
    queryFn: () => api.templates.list(),
  });

  return {
    vms: vmsData?.vms ?? [],
    templates: templatesData?.templates ?? [],
    isLoading,
    isError,
    refetch,
  };
};
