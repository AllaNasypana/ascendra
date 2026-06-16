'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { VMStatus } from '@/types';
import { getNextInventorySort, type InventorySortColumn } from './inventory-sorting';
import {
  INVENTORY_SEARCH_DEBOUNCE_MS,
  applyParamUpdates,
  buildPathnameWithQuery,
  buildSearchParamUpdate,
  buildSortParams,
  buildStatusParamUpdate,
  clearInventoryQueryParams,
  hasActiveInventoryFilters,
  parseSearchQuery,
  parseSortState,
  parseStatusFilter,
} from './inventory-query-params.helpers';

export const useInventoryQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = parseSearchQuery(searchParams);
  const statusFilter = useMemo(() => parseStatusFilter(searchParams), [searchParams]);
  const sortState = useMemo(() => parseSortState(searchParams), [searchParams]);

  const [searchInput, setSearchInput] = useState(search);
  const [trackedSearch, setTrackedSearch] = useState(search);

  if (search !== trackedSearch) {
    setTrackedSearch(search);
    setSearchInput(search);
  }

  const updateParams = (updates: Record<string, string | null>) => {
    const params = applyParamUpdates(searchParams, updates);
    router.replace(buildPathnameWithQuery(pathname, params), { scroll: false });
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchInput === search) {
        return;
      }

      const params = applyParamUpdates(searchParams, buildSearchParamUpdate(searchInput));
      router.replace(buildPathnameWithQuery(pathname, params), { scroll: false });
    }, INVENTORY_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [search, searchInput, pathname, router, searchParams]);

  const setStatusFilter = (status: VMStatus | 'all') => {
    updateParams(buildStatusParamUpdate(status));
  };

  const toggleSort = (column: InventorySortColumn) => {
    const nextSort = getNextInventorySort(sortState, column);
    updateParams(buildSortParams(nextSort));
  };

  const resetFilters = () => {
    setSearchInput('');

    const params = clearInventoryQueryParams(searchParams);
    router.replace(buildPathnameWithQuery(pathname, params), { scroll: false });
  };

  const hasActiveFilters = hasActiveInventoryFilters({
    search,
    searchInput,
    statusFilter,
    sortState,
  });

  return {
    search: searchInput,
    searchQuery: search,
    statusFilter,
    sortColumn: sortState.column,
    sortDirection: sortState.direction,
    setSearch: setSearchInput,
    setStatusFilter,
    toggleSort,
    resetFilters,
    hasActiveFilters,
  };
};
