import type { FC } from 'react';
import { MetricCard } from '@/components/metrics';
import { formatCurrency, formatPercent } from '@/utils';
import type { FleetOverviewMetrics } from './overview-metrics';

interface OverviewMetricCardsProps {
  metrics: FleetOverviewMetrics;
}

export const OverviewMetricCards: FC<OverviewMetricCardsProps> = ({ metrics }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <MetricCard
      title="Total VMs"
      value={`${metrics.counts.runningVms} / ${metrics.counts.totalVms}`}
      subtitle={`${metrics.counts.stoppedVms} stopped`}
    />
    <MetricCard
      title="Developers"
      value={String(metrics.counts.totalUsers)}
      subtitle="Engineers with workspace access"
    />
    <MetricCard
      title="Avg CPU"
      value={formatPercent(metrics.utilization.avgCpuPercent)}
      subtitle={`Peak ${formatPercent(metrics.utilization.peakCpuPercent)} · running VMs`}
    />
    <MetricCard
      title="Avg Memory"
      value={formatPercent(metrics.utilization.avgMemoryPercent)}
      subtitle={`Peak ${formatPercent(metrics.utilization.peakMemoryPercent)} · running VMs`}
    />
    <MetricCard
      title="Hourly Cost"
      value={formatCurrency(metrics.cost.hourly)}
      subtitle="Running VMs only"
    />
    <MetricCard
      title="Month to Date"
      value={formatCurrency(metrics.cost.monthToDate)}
      subtitle="Based on current run rate"
    />
    <MetricCard
      title="Projected Monthly"
      value={formatCurrency(metrics.cost.projectedMonthly)}
      subtitle="Hourly × 24h × 30 days"
    />
  </div>
);
