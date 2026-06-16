'use client';

import type { FC } from 'react';
import { UtilizationChart } from '@/components/charts';
import { MetricCard } from '@/components/metrics';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { formatCurrency, formatPercent } from '@/utils';

import { useOverview } from './use-overview';

export const FleetOverview: FC = () => {
  const { fleet, chartData, idleCount, isLoading, isError, refetch } = useOverview();

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

  if (isError || !fleet) {
    return (
      <div className="state-panel">
        <p className="text-muted-foreground">Failed to load fleet data.</p>
        <button type="button" onClick={() => refetch()} className="state-panel-action">
          Retry
        </button>
      </div>
    );
  }

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
          {idleCount} running VM{idleCount > 1 ? 's' : ''} appear idle (low CPU + inactive &gt;30m).
          Consider reviewing in Inventory.
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Utilization (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <UtilizationChart data={chartData ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
