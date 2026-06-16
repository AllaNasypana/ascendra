import type { VM } from '@/types';

export type InventorySortColumn = 'cpu' | 'memory' | 'disk' | 'cost';

export type InventorySortDirection = 'asc' | 'desc';

export interface InventorySortState {
  column: InventorySortColumn;
  direction: InventorySortDirection;
}

export const DEFAULT_INVENTORY_SORT: InventorySortState = {
  column: 'cpu',
  direction: 'desc',
};

const SORT_ACCESSORS: Record<InventorySortColumn, (vm: VM) => number> = {
  cpu: (vm) => vm.cpuUsagePercent,
  memory: (vm) => vm.memoryUsagePercent,
  disk: (vm) => vm.diskUsagePercent,
  cost: (vm) => vm.hourlyCost,
};

export const getNextInventorySort = (
  currentSort: InventorySortState,
  column: InventorySortColumn,
): InventorySortState => {
  if (currentSort.column !== column) {
    return {
      column,
      direction: DEFAULT_INVENTORY_SORT.direction,
    };
  }

  return {
    column,
    direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
  };
};

export const sortInventoryItems = <T extends { vm: VM }>(
  items: T[],
  sort: InventorySortState,
): T[] => {
  const getValue = SORT_ACCESSORS[sort.column];
  const directionMultiplier = sort.direction === 'asc' ? 1 : -1;

  return [...items].sort((a, b) => {
    const valueDiff = getValue(a.vm) - getValue(b.vm);

    if (valueDiff !== 0) {
      return valueDiff * directionMultiplier;
    }

    return a.vm.name.localeCompare(b.vm.name);
  });
};
