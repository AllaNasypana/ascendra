import { isTransitionStatus } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export const useVm = (vmId: string) => {
  const { data: vmData, isLoading: vmLoading } = useQuery({
    queryKey: ['vm', vmId],
    queryFn: () => api.vms.get(vmId),
    refetchInterval: (query) => {
      const status = query.state.data?.vm.status;
      return status && isTransitionStatus(status) ? 2000 : 30000;
    },
  });

  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['vm-metrics', vmId],
    queryFn: () => api.vms.metrics(vmId),
  });

  const { data: templatesData } = useQuery({
    queryKey: ['templates'],
    queryFn: () => api.templates.list(),
  });

  const vm = vmData?.vm;

  const template = templatesData?.templates.find((t) => t.id === vm?.templateId);
  const chartData = (metricsData?.metrics ?? []).map((m) => ({
    label: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    cpu: Math.round(m.cpuPercent),
    memory: Math.round(m.memoryPercent),
  }));

  const isTransitioning = isTransitionStatus(vm?.status);

  return {
    vm,
    template,
    chartData,
    isTransitioning,
    metricsLoading,
    vmLoading,
  };
};
