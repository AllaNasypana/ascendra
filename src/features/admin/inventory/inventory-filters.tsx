'use client';

import type { FC } from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import type { VMStatus } from '@/types';
import { EVMStatus } from '@/types';

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: VMStatus | 'all';
  onStatusFilterChange: (value: VMStatus | 'all') => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const InventoryFilters: FC<InventoryFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
  hasActiveFilters,
}) => (
  <div className="flex flex-col gap-3 sm:flex-row">
    <div className="relative flex-1">
      <FiSearch
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        placeholder="Search by name or owner…"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="pl-9"
        aria-label="Search VMs"
      />
    </div>

    <Select
      value={statusFilter}
      onValueChange={(value) => onStatusFilterChange(value as VMStatus | 'all')}
    >
      <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value={EVMStatus.RUNNING}>Running</SelectItem>
        <SelectItem value={EVMStatus.STOPPED}>Stopped</SelectItem>
        <SelectItem value={EVMStatus.STARTING}>Starting</SelectItem>
        <SelectItem value={EVMStatus.ERROR}>Error</SelectItem>
      </SelectContent>
    </Select>

    <Button
      type="button"
      variant="outline"
      onClick={onReset}
      disabled={!hasActiveFilters}
      className="w-full sm:w-auto"
    >
      Reset
    </Button>
  </div>
);
