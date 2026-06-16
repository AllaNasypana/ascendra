import type { FleetUtilization, VM } from '@/types';
import type { User } from '@/types';
import { EVMStatus } from '@/types';
import { getStore } from '@/mocks/store';
import { FLEET_METRICS_ASSUMPTIONS } from '@/features/admin/overview/fleet-metrics-assumptions';

export const getRunningVms = (vms: VM[]): VM[] =>
  vms.filter((vm) => vm.status === EVMStatus.RUNNING);

export const getStoppedVms = (vms: VM[]): VM[] =>
  vms.filter((vm) => vm.status === EVMStatus.STOPPED);

export const getEngineerUsers = (users: User[]): User[] =>
  users.filter((user) => user.role === 'engineer');

export interface RunningVmUtilization {
  avgCpuUtilizationPercent: number;
  peakCpuUtilizationPercent: number;
  avgMemoryUtilizationPercent: number;
  peakMemoryUtilizationPercent: number;
}

/** Aggregate CPU/memory from running VMs only — stopped VMs are excluded. */
export const calculateRunningVmUtilization = (runningVms: VM[]): RunningVmUtilization => {
  if (runningVms.length === 0) {
    return {
      avgCpuUtilizationPercent: 0,
      peakCpuUtilizationPercent: 0,
      avgMemoryUtilizationPercent: 0,
      peakMemoryUtilizationPercent: 0,
    };
  }

  const totalCpu = runningVms.reduce((sum, vm) => sum + vm.cpuUsagePercent, 0);
  const totalMemory = runningVms.reduce((sum, vm) => sum + vm.memoryUsagePercent, 0);

  return {
    avgCpuUtilizationPercent: Math.round((totalCpu / runningVms.length) * 10) / 10,
    peakCpuUtilizationPercent: Math.max(...runningVms.map((vm) => vm.cpuUsagePercent)),
    avgMemoryUtilizationPercent: Math.round((totalMemory / runningVms.length) * 10) / 10,
    peakMemoryUtilizationPercent: Math.max(...runningVms.map((vm) => vm.memoryUsagePercent)),
  };
};

export interface FleetCostMetrics {
  totalHourlyCost: number;
  monthToDateCost: number;
  projectedMonthlyCost: number;
}

/**
 * Cost is summed from running VMs only.
 * MTD = hourly run rate × 24h × day-of-month (mock: day 13).
 * Projected monthly = hourly run rate × 24h × 30 days.
 */
export const calculateFleetCosts = (runningVms: VM[]): FleetCostMetrics => {
  const totalHourlyCost = runningVms.reduce((sum, vm) => sum + vm.hourlyCost, 0);
  const roundedHourly = Math.round(totalHourlyCost * 100) / 100;

  return {
    totalHourlyCost: roundedHourly,
    monthToDateCost:
      Math.round(roundedHourly * 24 * FLEET_METRICS_ASSUMPTIONS.monthToDateDayOfMonth * 100) / 100,
    projectedMonthlyCost:
      Math.round(roundedHourly * 24 * FLEET_METRICS_ASSUMPTIONS.projectedMonthlyDays * 100) / 100,
  };
};

/**
 * Mock 24h trend — synthetic sine-wave data, not real telemetry.
 * See fleet-metrics-assumptions.ts for production expectations.
 */
export const buildMockUtilizationTrend = (
  runningCount: number,
): FleetUtilization['utilizationTrend'] => {
  const now = Date.now();
  const hoursAgo = (hours: number) => new Date(now - hours * 3_600_000).toISOString();
  const trend: FleetUtilization['utilizationTrend'] = [];

  for (let hour = FLEET_METRICS_ASSUMPTIONS.utilizationTrendHours - 1; hour >= 0; hour--) {
    const cpuVariance = Math.sin(hour * 0.3) * 12 + 35;
    const memVariance = Math.sin(hour * 0.4) * 10 + 45;

    trend.push({
      timestamp: hoursAgo(hour),
      cpuPercent: Math.max(0, Math.min(100, cpuVariance)),
      memoryPercent: Math.max(0, Math.min(100, memVariance)),
      runningVms: runningCount + Math.floor(Math.sin(hour) * 1),
    });
  }

  return trend;
};

export const computeFleetUtilization = (
  period: FleetUtilization['period'] = 'real-time',
): FleetUtilization => {
  const { users, vms } = getStore();
  const running = getRunningVms(vms);
  const stopped = getStoppedVms(vms);
  const engineers = getEngineerUsers(users);
  const utilization = calculateRunningVmUtilization(running);
  const costs = calculateFleetCosts(running);

  return {
    period,
    totalVms: vms.length,
    runningVms: running.length,
    stoppedVms: stopped.length,
    totalUsers: engineers.length,
    avgCpuUtilizationPercent: utilization.avgCpuUtilizationPercent,
    peakCpuUtilizationPercent: utilization.peakCpuUtilizationPercent,
    avgMemoryUtilizationPercent: utilization.avgMemoryUtilizationPercent,
    peakMemoryUtilizationPercent: utilization.peakMemoryUtilizationPercent,
    totalHourlyCost: costs.totalHourlyCost,
    monthToDateCost: costs.monthToDateCost,
    projectedMonthlyCost: costs.projectedMonthlyCost,
    utilizationTrend: buildMockUtilizationTrend(running.length),
    vmMetrics: vms.map((vm) => ({
      vmId: vm.id,
      cpuPercent: vm.cpuUsagePercent,
      memoryPercent: vm.memoryUsagePercent,
      diskPercent: vm.diskUsagePercent,
      status: vm.status,
    })),
  };
};
