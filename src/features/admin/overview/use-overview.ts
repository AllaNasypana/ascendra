'use client';

import { isIdleVm } from "@/utils";
import { EVMStatus } from "@/types";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";


export const useOverview = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["fleet"],
        queryFn: () => api.fleet.get("real-time"),
      });
    
      const { data: vmsData } = useQuery({
        queryKey: ["vms"],
        queryFn: () => api.vms.list(),
      });

      const  fleet = data ? data?.fleet : null;

  const allVms = vmsData?.vms ?? [];

  const chartData = fleet?.utilizationTrend.map((p) => ({
    label: new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cpu: Math.round(p.cpuPercent),
    memory: Math.round(p.memoryPercent),
    runningVms: p.runningVms,
  }));


  const idleCount = allVms.filter(
    (v) => v.status === EVMStatus.RUNNING && isIdleVm(v.lastActiveAt, v.cpuUsagePercent)
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