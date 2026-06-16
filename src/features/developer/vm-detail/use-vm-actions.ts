'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/utils/errors';

interface VmActionConfig {
  action: () => Promise<unknown>;
  pendingMessage: string;
  successMessage: string;
}

function useVmActionMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  vmId: string,
  { action, pendingMessage, successMessage }: VmActionConfig,
) {
  return useMutation({
    mutationFn: action,
    onMutate: () => toast.info(pendingMessage),
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: queryKeys.vms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.vms.detail(vmId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.fleet.all });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Action failed'));
    },
  });
}

export const useVmActions = (vmId: string) => {
  const queryClient = useQueryClient();

  const start = useVmActionMutation(queryClient, vmId, {
    action: () => api.vms.start(vmId),
    pendingMessage: 'Starting VM…',
    successMessage: 'VM started',
  });

  const stop = useVmActionMutation(queryClient, vmId, {
    action: () => api.vms.stop(vmId),
    pendingMessage: 'Stopping VM…',
    successMessage: 'VM stopped',
  });

  const restart = useVmActionMutation(queryClient, vmId, {
    action: () => api.vms.restart(vmId),
    pendingMessage: 'Restarting VM…',
    successMessage: 'VM restarted',
  });

  const isPending = start.isPending || stop.isPending || restart.isPending;

  return {
    start: () => start.mutate(),
    stop: () => stop.mutate(),
    restart: () => restart.mutate(),
    isPending,
  };
};
