import type { VM, MetricPoint, VMStatus } from '@/types';
import { EVMStatus } from '@/types';
import { getStore } from '@/mocks/store';
import { simulateDelay } from '@/utils/general';

export const getVmById = (id: string): VM | undefined => getStore().vmsMap.get(id);

export const listVms = (ownerId?: string): VM[] => {
  const { vms } = getStore();
  if (!ownerId) return vms;
  return vms.filter((vm) => vm.ownerId === ownerId);
};

export const getMetricPointsForVm = (vmId: string): MetricPoint[] =>
  getStore().metricPoints[vmId] ?? [];

export const patchVm = (id: string, patch: Partial<VM>): VM | undefined => {
  const store = getStore();
  const vm = store.vmsMap.get(id);
  if (!vm) return undefined;
  Object.assign(vm, patch);
  store.vmsMap.set(id, vm);
  return vm;
};

export const isTransitionStatus = (status?: VMStatus): boolean =>
  status === EVMStatus.STARTING || status === EVMStatus.STOPPING;

export const transitionVm = async (
  id: string,
  fromStatuses: VMStatus[],
  intermediate: VMStatus,
  final: VMStatus,
  delayMs: number,
): Promise<{ vm: VM } | { error: string; status: number } | null> => {
  const vm = getVmById(id);
  if (!vm) return null;
  if (!fromStatuses.includes(vm.status)) {
    return { error: `Cannot transition from ${vm.status}`, status: 409 };
  }

  patchVm(id, { status: intermediate });
  await simulateDelay(delayMs);

  const updates: Partial<VM> = { status: final };

  if (final === EVMStatus.RUNNING) {
    updates.startedAt = new Date().toISOString();
    updates.lastActiveAt = new Date().toISOString();
    updates.cpuUsagePercent = Math.floor(Math.random() * 30) + 10;
    updates.memoryUsagePercent = Math.floor(Math.random() * 30) + 20;
  } else if (final === EVMStatus.STOPPED) {
    updates.startedAt = null;
    updates.cpuUsagePercent = 0;
    updates.memoryUsagePercent = 0;
  }

  const updated = patchVm(id, updates);
  return updated ? { vm: updated } : null;
};

export const stopVm = async (
  id: string,
): Promise<{ vm: VM } | { error: string; status: number } | null> => {
  const vm = getVmById(id);
  if (!vm) return null;
  if (vm.status !== EVMStatus.RUNNING) {
    return { error: `Cannot stop VM in ${vm.status} state`, status: 409 };
  }

  patchVm(id, { status: EVMStatus.STOPPING });
  await simulateDelay(1000);
  const updated = patchVm(id, {
    status: EVMStatus.STOPPED,
    startedAt: null,
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
  });

  return updated ? { vm: updated } : null;
};

export const restartVm = async (
  id: string,
): Promise<{ vm: VM } | { error: string; status: number } | null> => {
  const vm = getVmById(id);
  if (!vm) return null;
  if (vm.status !== EVMStatus.RUNNING) {
    return { error: `Cannot restart VM in ${vm.status} state`, status: 409 };
  }

  patchVm(id, { status: EVMStatus.STOPPING });
  await simulateDelay(800);
  patchVm(id, { status: EVMStatus.STARTING });
  await simulateDelay(1200);

  const updated = patchVm(id, {
    status: EVMStatus.RUNNING,
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  });

  return updated ? { vm: updated } : null;
};
