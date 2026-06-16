import { EVMStatus, type VMStatus } from '@/types';
import {
  DEFAULT_INVENTORY_SORT,
  type InventorySortColumn,
  type InventorySortDirection,
  type InventorySortState,
} from './inventory-sorting';

export const INVENTORY_SEARCH_PARAM = 'q';
export const INVENTORY_STATUS_PARAM = 'status';
export const INVENTORY_SORT_PARAM = 'sort';
export const INVENTORY_ORDER_PARAM = 'order';
export const INVENTORY_SEARCH_DEBOUNCE_MS = 300;

export const INVENTORY_QUERY_PARAMS = [
  INVENTORY_SEARCH_PARAM,
  INVENTORY_STATUS_PARAM,
  INVENTORY_SORT_PARAM,
  INVENTORY_ORDER_PARAM,
] as const;

const SORT_COLUMNS: InventorySortColumn[] = ['cpu', 'memory', 'disk', 'cost'];
const SORT_DIRECTIONS: InventorySortDirection[] = ['asc', 'desc'];
const STATUS_VALUES = new Set<string>([...Object.values(EVMStatus), 'all']);

export const isSortColumn = (value: string | null): value is InventorySortColumn =>
  value !== null && SORT_COLUMNS.includes(value as InventorySortColumn);

export const isSortDirection = (value: string | null): value is InventorySortDirection =>
  value !== null && SORT_DIRECTIONS.includes(value as InventorySortDirection);

export const isStatusFilter = (value: string | null): value is VMStatus | 'all' =>
  value !== null && STATUS_VALUES.has(value);

export const parseSearchQuery = (searchParams: URLSearchParams): string =>
  searchParams.get(INVENTORY_SEARCH_PARAM) ?? '';

export const parseSortState = (searchParams: URLSearchParams): InventorySortState => {
  const sort = searchParams.get(INVENTORY_SORT_PARAM);

  if (!isSortColumn(sort)) {
    return DEFAULT_INVENTORY_SORT;
  }

  const order = searchParams.get(INVENTORY_ORDER_PARAM);

  return {
    column: sort,
    direction: isSortDirection(order) ? order : DEFAULT_INVENTORY_SORT.direction,
  };
};

export const parseStatusFilter = (searchParams: URLSearchParams): VMStatus | 'all' => {
  const status = searchParams.get(INVENTORY_STATUS_PARAM);

  if (!status || status === 'all') {
    return 'all';
  }

  return isStatusFilter(status) ? status : 'all';
};

export const isDefaultSort = (sort: InventorySortState): boolean =>
  sort.column === DEFAULT_INVENTORY_SORT.column &&
  sort.direction === DEFAULT_INVENTORY_SORT.direction;

export const buildSortParams = (sort: InventorySortState): Record<string, string | null> => {
  if (isDefaultSort(sort)) {
    return { [INVENTORY_SORT_PARAM]: null, [INVENTORY_ORDER_PARAM]: null };
  }

  return {
    [INVENTORY_SORT_PARAM]: sort.column,
    [INVENTORY_ORDER_PARAM]: sort.direction,
  };
};

export const buildStatusParamUpdate = (
  status: VMStatus | 'all',
): Record<string, string | null> => ({
  [INVENTORY_STATUS_PARAM]: status === 'all' ? null : status,
});

export const buildSearchParamUpdate = (search: string): Record<string, string | null> => ({
  [INVENTORY_SEARCH_PARAM]: search.trim() || null,
});

export const applyParamUpdates = (
  searchParams: URLSearchParams,
  updates: Record<string, string | null>,
): URLSearchParams => {
  const params = new URLSearchParams(searchParams.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  return params;
};

export const clearInventoryQueryParams = (searchParams: URLSearchParams): URLSearchParams => {
  const params = new URLSearchParams(searchParams.toString());

  for (const param of INVENTORY_QUERY_PARAMS) {
    params.delete(param);
  }

  return params;
};

export const buildPathnameWithQuery = (pathname: string, params: URLSearchParams): string => {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

interface HasActiveInventoryFiltersParams {
  search: string;
  searchInput: string;
  statusFilter: VMStatus | 'all';
  sortState: InventorySortState;
}

export const hasActiveInventoryFilters = ({
  search,
  searchInput,
  statusFilter,
  sortState,
}: HasActiveInventoryFiltersParams): boolean =>
  search !== '' || searchInput.trim() !== '' || statusFilter !== 'all' || !isDefaultSort(sortState);
