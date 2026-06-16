'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { useTemplates } from '@/hooks/use-templates';
import { useUsers } from '@/hooks/use-users';
import { createMapById } from '@/utils/collection';
import type { VMStatus } from '@/types';
import {
  DEFAULT_INVENTORY_SORT,
  getNextInventorySort,
  type InventorySortColumn,
  type InventorySortDirection,
  type InventorySortState,
} from './inventory-sorting';
import { buildInventoryItems } from './inventory-mappers';

export type { InventorySortColumn, InventorySortDirection };

const DEFAULT_SEARCH = '';
const DEFAULT_STATUS_FILTER: VMStatus | 'all' = 'all';

export const useInventory = () => {
  const [search, setSearch] = useState(DEFAULT_SEARCH);
  const [statusFilter, setStatusFilter] = useState<VMStatus | 'all'>(DEFAULT_STATUS_FILTER);
  const [sortState, setSortState] = useState<InventorySortState>(DEFAULT_INVENTORY_SORT);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.vms.list(),
    queryFn: () => api.vms.list(),
  });

  const { data: usersData } = useUsers();
  const { templatesById } = useTemplates();

  const usersById = createMapById(usersData?.users ?? []);

  const inventoryItems = buildInventoryItems(
    data?.vms ?? [],
    usersById,
    templatesById,
    search,
    statusFilter,
    sortState,
  );

  const toggleSort = (column: InventorySortColumn) => {
    setSortState((currentSort) => getNextInventorySort(currentSort, column));
  };

  const resetFilters = () => {
    setSearch(DEFAULT_SEARCH);
    setStatusFilter(DEFAULT_STATUS_FILTER);
    setSortState(DEFAULT_INVENTORY_SORT);
  };

  const hasActiveFilters =
    search !== DEFAULT_SEARCH ||
    statusFilter !== DEFAULT_STATUS_FILTER ||
    sortState.column !== DEFAULT_INVENTORY_SORT.column ||
    sortState.direction !== DEFAULT_INVENTORY_SORT.direction;

  return {
    data,
    isLoading,
    isError,
    refetch,
    inventoryItems,
    totalVms: data?.vms.length ?? 0,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortColumn: sortState.column,
    sortDirection: sortState.direction,
    toggleSort,
    resetFilters,
    hasActiveFilters,
  };
};
