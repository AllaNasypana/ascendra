import type { VM } from '@/types';
import { EVMStatus } from '@/types';

/** Running VM with CPU below this threshold and no recent activity is considered idle. */
export const IDLE_CPU_THRESHOLD_PERCENT = 5;

/** Minutes without activity before a running VM is flagged as idle. */
export const IDLE_INACTIVITY_MINUTES = 30;

/** Running VM at or above this CPU usage is considered hot / overloaded. */
export const HOT_CPU_THRESHOLD_PERCENT = 80;

/** Running VM at or above this memory usage is considered hot / overloaded. */
export const HOT_MEMORY_THRESHOLD_PERCENT = 85;

export const isRunningVm = (vm: VM): boolean => vm.status === EVMStatus.RUNNING;

/**
 * Idle VMs are running but underused: low CPU and no user activity for 30+ minutes.
 * Admins use this to find wasted infrastructure spend.
 */
export const isIdleVm = (
  lastActiveAt: string,
  cpuUsagePercent: number,
  thresholdMinutes = IDLE_INACTIVITY_MINUTES,
): boolean => {
  const idleMs = Date.now() - new Date(lastActiveAt).getTime();
  return idleMs > thresholdMinutes * 60_000 && cpuUsagePercent < IDLE_CPU_THRESHOLD_PERCENT;
};

/**
 * Hot VMs are running with high resource pressure (CPU or memory).
 * Admins use this to spot capacity bottlenecks before developers are impacted.
 */
export const isHotVm = (
  cpuUsagePercent: number,
  memoryUsagePercent: number,
  cpuThreshold = HOT_CPU_THRESHOLD_PERCENT,
  memoryThreshold = HOT_MEMORY_THRESHOLD_PERCENT,
): boolean => cpuUsagePercent >= cpuThreshold || memoryUsagePercent >= memoryThreshold;

export const isVmIdle = (vm: VM): boolean =>
  isRunningVm(vm) && isIdleVm(vm.lastActiveAt, vm.cpuUsagePercent);

export const isVmHot = (vm: VM): boolean =>
  isRunningVm(vm) && isHotVm(vm.cpuUsagePercent, vm.memoryUsagePercent);

export interface VmHealthSummary {
  idleCount: number;
  hotCount: number;
}

export const summarizeVmHealth = (vms: VM[]): VmHealthSummary => ({
  idleCount: vms.filter(isVmIdle).length,
  hotCount: vms.filter(isVmHot).length,
});
