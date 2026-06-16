'use client';

import { isIdleVm } from '@/utils';
import { mapFleetTrendToChartData } from '@/utils/charts';
import { EVMStatus } from '@/types';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { useQuery } from '@tanstack/react-query';

export const useOverview = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.fleet.detail('real-time'),
    queryFn: () => api.fleet.get('real-time'),
  });

  const { data: vmsData } = useQuery({
    queryKey: queryKeys.vms.list(),
    queryFn: () => api.vms.list(),
  });

  const fleet = data?.fleet ?? null;
  const allVms = vmsData?.vms ?? [];
  const chartData = fleet ? mapFleetTrendToChartData(fleet.utilizationTrend) : undefined;

  const idleCount = allVms.filter(
    (vm) => vm.status === EVMStatus.RUNNING && isIdleVm(vm.lastActiveAt, vm.cpuUsagePercent),
  ).length;

  return {
    fleet,
    chartData,
    idleCount,
    isLoading,
    isError,
    refetch,
  };
};
