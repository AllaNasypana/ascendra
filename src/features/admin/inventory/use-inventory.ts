"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { PublicUser, VM, VMStatus, VMTemplate } from "@/types";

import {
  DEFAULT_INVENTORY_SORT,
  getNextInventorySort,
  sortInventoryItems,
  type InventorySortColumn,
  type InventorySortDirection,
  type InventorySortState,
} from "./inventory-sorting";

export type { InventorySortColumn, InventorySortDirection };

interface InventoryItem {
  vm: VM;
  owner?: PublicUser;
  template?: VMTemplate;
}

const DEFAULT_SEARCH = "";
const DEFAULT_STATUS_FILTER: VMStatus | "all" = "all";

const createMapById = <T extends { id: string }>(items: T[] = []) => {
  return new Map(items.map((item) => [item.id, item]));
};

const normalizeSearch = (value: string) => {
  return value.trim().toLowerCase();
};

const matchesSearch = (
  vm: VM,
  owner: PublicUser | undefined,
  search: string
) => {
  if (!search) return true;

  return (
    vm.name.toLowerCase().includes(search) ||
    owner?.name.toLowerCase().includes(search) ||
    owner?.email.toLowerCase().includes(search)
  );
};

const matchesStatus = (vm: VM, status: VMStatus | "all") => {
  return status === "all" || vm.status === status;
};

export const useInventory = () => {
  const [search, setSearch] = useState(DEFAULT_SEARCH);
  const [statusFilter, setStatusFilter] =
    useState<VMStatus | "all">(DEFAULT_STATUS_FILTER);
  const [sortState, setSortState] =
    useState<InventorySortState>(DEFAULT_INVENTORY_SORT);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["vms"],
    queryFn: api.vms.list,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: api.users.list,
  });

  const { data: templatesData } = useQuery({
    queryKey: ["templates"],
    queryFn: api.templates.list,
  });

  const usersById = useMemo(
    () => createMapById(usersData?.users ?? []),
    [usersData?.users]
  );

  const templatesById = useMemo(
    () => createMapById(templatesData?.templates ?? []),
    [templatesData?.templates]
  );

  const inventoryItems = useMemo(() => {
    const normalizedSearch = normalizeSearch(search);

    const items: InventoryItem[] = (data?.vms ?? [])
      .map((vm) => ({
        vm,
        owner: usersById.get(vm.ownerId),
        template: templatesById.get(vm.templateId),
      }))
      .filter(({ vm, owner }) => {
        return (
          matchesSearch(vm, owner, normalizedSearch) &&
          matchesStatus(vm, statusFilter)
        );
      });

    return sortInventoryItems(items, sortState);
  }, [data?.vms, usersById, templatesById, search, statusFilter, sortState]);

  const toggleSort = useCallback((column: InventorySortColumn) => {
    setSortState((currentSort) => getNextInventorySort(currentSort, column));
  }, []);

  const resetFilters = useCallback(() => {
    setSearch(DEFAULT_SEARCH);
    setStatusFilter(DEFAULT_STATUS_FILTER);
    setSortState(DEFAULT_INVENTORY_SORT);
  }, []);

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