'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '@/lib/api-client';

export const useVmActions = (vmId: string) => {
  const queryClient = useQueryClient();

  const invalidate = (): void => {
    queryClient.invalidateQueries({ queryKey: ['vms'] });
    queryClient.invalidateQueries({ queryKey: ['vm', vmId] });
    queryClient.invalidateQueries({ queryKey: ['fleet'] });
  };

  const start = useMutation({
    mutationFn: () => api.vms.start(vmId),
    onMutate: () => toast.info('Starting VM…'),
    onSuccess: () => {
      toast.success('VM started');
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Action failed';
      toast.error(message);
    },
  });

  const stop = useMutation({
    mutationFn: () => api.vms.stop(vmId),
    onMutate: () => toast.info('Stopping VM…'),
    onSuccess: () => {
      toast.success('VM stopped');
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Action failed';
      toast.error(message);
    },
  });

  const restart = useMutation({
    mutationFn: () => api.vms.restart(vmId),
    onMutate: () => toast.info('Restarting VM…'),
    onSuccess: () => {
      toast.success('VM restarted');
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Action failed';
      toast.error(message);
    },
  });

  const isPending = start.isPending || stop.isPending || restart.isPending;

  return {
    start: () => start.mutate(),
    stop: () => stop.mutate(),
    restart: () => restart.mutate(),
    isPending,
  };
};
