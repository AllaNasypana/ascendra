import { mapMetricsToChartData } from '@/utils/charts';
import { isTransitionStatus } from '@/utils';
import { getVmPollingInterval } from '@/hooks/use-vm-polling-interval';
import { useTemplates } from '@/hooks/use-templates';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

export const useVm = (vmId: string) => {
  const { data: vmData, isLoading: vmLoading } = useQuery({
    queryKey: queryKeys.vms.detail(vmId),
    queryFn: () => api.vms.get(vmId),
    refetchInterval: (query) => getVmPollingInterval(query.state.data?.vm.status),
  });

  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: queryKeys.vms.metrics(vmId),
    queryFn: () => api.vms.metrics(vmId),
  });

  const { getTemplate } = useTemplates();

  const vm = vmData?.vm;
  const template = vm ? getTemplate(vm.templateId) : undefined;
  const chartData = mapMetricsToChartData(metricsData?.metrics ?? []);
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
