import type { VMTemplate } from '@/types';
import type { InventoryItem } from '@/types/inventory';
import type { InventorySortState } from '@/features/admin/inventory/inventory-sorting';
import { sortInventoryItems } from '@/features/admin/inventory/inventory-sorting';

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesInventorySearch(
  vm: InventoryItem['vm'],
  owner: InventoryItem['owner'],
  search: string,
): boolean {
  if (!search) return true;

  return (
    vm.name.toLowerCase().includes(search) ||
    (owner?.name.toLowerCase().includes(search) ?? false) ||
    (owner?.email.toLowerCase().includes(search) ?? false)
  );
}

export function matchesInventoryStatus(
  vm: InventoryItem['vm'],
  status: InventoryItem['vm']['status'] | 'all',
): boolean {
  return status === 'all' || vm.status === status;
}

export function buildInventoryItems(
  vms: InventoryItem['vm'][],
  usersById: Map<string, NonNullable<InventoryItem['owner']>>,
  templatesById: Map<string, VMTemplate>,
  search: string,
  statusFilter: InventoryItem['vm']['status'] | 'all',
  sortState: InventorySortState,
): InventoryItem[] {
  const normalizedSearch = normalizeSearch(search);

  const items = vms
    .map((vm) => ({
      vm,
      owner: usersById.get(vm.ownerId),
      template: templatesById.get(vm.templateId),
    }))
    .filter(
      ({ vm, owner }) =>
        matchesInventorySearch(vm, owner, normalizedSearch) &&
        matchesInventoryStatus(vm, statusFilter),
    );

  return sortInventoryItems(items, sortState);
}
