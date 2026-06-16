'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { buildFleetOverviewMetrics } from './overview-metrics';

export const useOverview = () => {
  const fleetQuery = useQuery({
    queryKey: queryKeys.fleet.detail('real-time'),
    queryFn: () => api.fleet.get('real-time'),
  });

  const vmsQuery = useQuery({
    queryKey: queryKeys.vms.list(),
    queryFn: () => api.vms.list(),
  });

  const fleet = fleetQuery.data?.fleet ?? null;
  const vms = vmsQuery.data?.vms ?? [];
  const metrics = fleet ? buildFleetOverviewMetrics(fleet, vms) : null;

  return {
    metrics,
    isLoading: fleetQuery.isLoading || vmsQuery.isLoading,
    isError: fleetQuery.isError || vmsQuery.isError,
    refetch: () => {
      void fleetQuery.refetch();
      void vmsQuery.refetch();
    },
  };
};
