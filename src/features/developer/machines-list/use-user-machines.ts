import { useAuth } from '@/hooks/use-auth';
import { useTemplates } from '@/hooks/use-templates';
import { getVmListPollingInterval } from '@/hooks/use-vm-polling-interval';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { useQuery } from '@tanstack/react-query';

export const useUserMachines = () => {
  const { user } = useAuth();
  const { templates } = useTemplates();

  const {
    data: vmsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.vms.list({ ownerId: user?.id }),
    queryFn: () => api.vms.list({ ownerId: user!.id }),
    enabled: Boolean(user),
    refetchInterval: (query) => {
      const statuses = (query.state.data?.vms ?? []).map((vm) => vm.status);
      return getVmListPollingInterval(statuses);
    },
  });

  return {
    vms: vmsData?.vms ?? [],
    templates,
    isLoading,
    isError,
    refetch,
  };
};
