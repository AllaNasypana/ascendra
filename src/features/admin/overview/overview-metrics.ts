import type { FleetUtilization, VM } from '@/types';
import { mapFleetTrendToChartData } from '@/utils/charts';
import type { FleetChartDataPoint } from '@/types/charts';
import { summarizeVmHealth } from '@/utils/vm-health';

export interface FleetOverviewMetrics {
  counts: {
    totalVms: number;
    runningVms: number;
    stoppedVms: number;
    totalUsers: number;
  };
  utilization: {
    avgCpuPercent: number;
    peakCpuPercent: number;
    avgMemoryPercent: number;
    peakMemoryPercent: number;
  };
  cost: {
    hourly: number;
    monthToDate: number;
    projectedMonthly: number;
  };
  health: {
    idleCount: number;
    hotCount: number;
  };
  chartData: FleetChartDataPoint[];
}

/** Maps API fleet data and VM list into a render-ready overview model. */
export const buildFleetOverviewMetrics = (
  fleet: FleetUtilization,
  vms: VM[],
): FleetOverviewMetrics => ({
  counts: {
    totalVms: fleet.totalVms,
    runningVms: fleet.runningVms,
    stoppedVms: fleet.stoppedVms,
    totalUsers: fleet.totalUsers,
  },
  utilization: {
    avgCpuPercent: fleet.avgCpuUtilizationPercent,
    peakCpuPercent: fleet.peakCpuUtilizationPercent,
    avgMemoryPercent: fleet.avgMemoryUtilizationPercent,
    peakMemoryPercent: fleet.peakMemoryUtilizationPercent,
  },
  cost: {
    hourly: fleet.totalHourlyCost,
    monthToDate: fleet.monthToDateCost,
    projectedMonthly: fleet.projectedMonthlyCost,
  },
  health: summarizeVmHealth(vms),
  chartData: mapFleetTrendToChartData(fleet.utilizationTrend),
});
