"use client";

import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { api } from "@/lib/api-client";
import { UtilizationChart, VmDistributionChart } from "@/components/charts";
import { MetricCard } from "@/components/metrics";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/ui";
import { formatCurrency, formatPercent, isIdleVm } from "@/utils";
import { EVMStatus } from "@/types";

export const FleetOverview: FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["fleet"],
    queryFn: () => api.fleet.get("real-time"),
  });

  const { data: vmsData } = useQuery({
    queryKey: ["vms"],
    queryFn: () => api.vms.list(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="state-panel">
        <p className="text-muted-foreground">Failed to load fleet data.</p>
        <button type="button" onClick={() => refetch()} className="state-panel-action">
          Retry
        </button>
      </div>
    );
  }

  const { fleet } = data;

  const allVms = vmsData?.vms ?? [];

  const chartData = fleet.utilizationTrend.map((p) => ({
    label: new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cpu: Math.round(p.cpuPercent),
    memory: Math.round(p.memoryPercent),
    runningVms: p.runningVms,
  }));

  const distributionData = allVms
    .filter((v) => v.status === EVMStatus.RUNNING)
    .map((v) => ({
      name: v.name,
      cpu: v.cpuUsagePercent,
      isIdle: isIdleVm(v.lastActiveAt, v.cpuUsagePercent),
    }));

  const idleCount = allVms.filter(
    (v) => v.status === EVMStatus.RUNNING && isIdleVm(v.lastActiveAt, v.cpuUsagePercent)
  ).length;

  return (
    <div className="space-y-6">
      <header className="page-header">
        <h1 className="page-title">Fleet Overview</h1>
        <p className="page-description">
          Infrastructure health and utilization across {fleet.totalUsers} developers
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total VMs"
          value={`${fleet.runningVms} / ${fleet.totalVms}`}
          subtitle={`${fleet.stoppedVms} stopped`}
        />
        <MetricCard
          title="Avg CPU"
          value={formatPercent(fleet.avgCpuUtilizationPercent)}
          subtitle={`Peak ${formatPercent(fleet.peakCpuUtilizationPercent)}`}
        />
        <MetricCard
          title="Avg Memory"
          value={formatPercent(fleet.avgMemoryUtilizationPercent)}
          subtitle={`Peak ${formatPercent(fleet.peakMemoryUtilizationPercent)}`}
        />
        <MetricCard
          title="Hourly Cost"
          value={formatCurrency(fleet.totalHourlyCost)}
          subtitle={`MTD ${formatCurrency(fleet.monthToDateCost)} · Proj ${formatCurrency(fleet.projectedMonthlyCost)}/mo`}
        />
      </div>

      {idleCount > 0 && (
        <div className="alert-banner" role="status">
          {idleCount} running VM{idleCount > 1 ? "s" : ""} appear idle (low CPU + inactive &gt;30m).
          Consider reviewing in Inventory.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Utilization (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <UtilizationChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPU by VM</CardTitle>
          </CardHeader>
          <CardContent>
            {distributionData.length > 0 ? (
              <VmDistributionChart data={distributionData} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">No running VMs</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Muted bars indicate idle VMs (&lt;5% CPU, inactive &gt;30m)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
