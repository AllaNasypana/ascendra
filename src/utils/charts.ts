import type { MetricPoint, FleetUtilization } from '@/types';
import type { ChartDataPoint, FleetChartDataPoint } from '@/types/charts';

function formatChartLabel(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function mapMetricsToChartData(metrics: MetricPoint[]): ChartDataPoint[] {
  return metrics.map((metric) => ({
    label: formatChartLabel(metric.timestamp),
    cpu: Math.round(metric.cpuPercent),
    memory: Math.round(metric.memoryPercent),
  }));
}

export function mapFleetTrendToChartData(
  trend: FleetUtilization['utilizationTrend'],
): FleetChartDataPoint[] {
  return trend.map((point) => ({
    label: formatChartLabel(point.timestamp),
    cpu: Math.round(point.cpuPercent),
    memory: Math.round(point.memoryPercent),
    runningVms: point.runningVms,
  }));
}
