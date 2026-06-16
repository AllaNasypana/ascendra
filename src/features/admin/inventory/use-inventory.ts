'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { useTemplates } from '@/hooks/use-templates';
import { useUsers } from '@/hooks/use-users';
import { createMapById } from '@/utils/collection';
import { buildInventoryItems } from './inventory-filtering';
import { useInventoryQueryParams } from './use-inventory-query-params';

export type { InventorySortColumn, InventorySortDirection } from './inventory-sorting';

export const useInventory = () => {
  const {
    search,
    searchQuery,
    statusFilter,
    sortColumn,
    sortDirection,
    setSearch,
    setStatusFilter,
    toggleSort,
    resetFilters,
    hasActiveFilters,
  } = useInventoryQueryParams();

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
    searchQuery,
    statusFilter,
    { column: sortColumn, direction: sortDirection },
  );

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
    sortColumn,
    sortDirection,
    toggleSort,
    resetFilters,
    hasActiveFilters,
  };
};
