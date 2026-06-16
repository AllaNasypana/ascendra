'use client';

import type { FC } from 'react';
import { UtilizationChart } from '@/components/charts';
import { PageHeader, QueryErrorPanel } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { useOverview } from './use-overview';
import { OverviewMetricCards } from './overview-metric-cards';
import { OverviewHealthAlerts } from './overview-health-alerts';

export const FleetOverview: FC = () => {
  const { metrics, isLoading, isError, refetch } = useOverview();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (isError || !metrics) {
    return <QueryErrorPanel message="Failed to load fleet data." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Overview"
        description={`Infrastructure health across ${metrics.counts.totalUsers} developers and ${metrics.counts.totalVms} machines`}
      />

      <OverviewMetricCards metrics={metrics} />

      <OverviewHealthAlerts
        idleCount={metrics.health.idleCount}
        hotCount={metrics.health.hotCount}
      />

      <Card>
        <CardHeader>
          <CardTitle>Fleet Utilization (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <UtilizationChart data={metrics.chartData} showRunningVms />
        </CardContent>
      </Card>
    </div>
  );
};
