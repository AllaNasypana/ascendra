'use client';

import Link from 'next/link';
import type { FC } from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import type { VMStatus } from '@/types';
import { EVMStatus } from '@/types';
import { cn, formatCurrency, isIdleVm } from '@/utils';
import { useInventory } from './use-inventory';
import { SortableHeader } from './sortable-header';
import { MetricCell } from './metric-cell';

export const VmInventory: FC = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    inventoryItems,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortColumn,
    sortDirection,
    toggleSort,
    resetFilters,
    hasActiveFilters,
  } = useInventory();

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  if (isError) {
    return (
      <div className="state-panel">
        <p className="text-muted-foreground">Failed to load inventory.</p>

        <Button type="button" onClick={() => refetch()} className="state-panel-action">
          Retry
        </Button>
      </div>
    );
  }

  const totalVms = data?.vms?.length ?? 0;

  return (
    <div className="space-y-6">
      <header className="page-header">
        <h1 className="page-title">VM Inventory</h1>
        <p className="page-description">
          {inventoryItems.length} of {totalVms} machines
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />

          <Input
            placeholder="Search by name or owner…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
            aria-label="Search VMs"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as VMStatus | 'all')}
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
          onClick={resetFilters}
          disabled={!hasActiveFilters}
          className="w-full sm:w-auto"
        >
          Reset
        </Button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Owner</th>
              <th scope="col">Template</th>
              <th scope="col">Status</th>

              <SortableHeader
                label="CPU"
                column="cpu"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={toggleSort}
              />

              <SortableHeader
                label="Memory"
                column="memory"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={toggleSort}
              />

              <SortableHeader
                label="Disk"
                column="disk"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={toggleSort}
              />

              <SortableHeader
                label="Cost/hr"
                column="cost"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={toggleSort}
              />
            </tr>
          </thead>

          <tbody>
            {inventoryItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="data-table-empty">
                  No VMs match your filters
                </td>
              </tr>
            ) : (
              inventoryItems.map(({ vm, owner, template }) => {
                const isIdle =
                  vm.status === EVMStatus.RUNNING && isIdleVm(vm.lastActiveAt, vm.cpuUsagePercent);

                return (
                  <tr key={vm.id} className={cn(isIdle && 'alert-idle-row')}>
                    <td>
                      <Link href={`./${ROUTES.inventory}/${vm.id}`} className="flex w-full py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{vm.name}</span>
                          {isIdle && <span className="idle-tag">Idle</span>}
                        </div>
                      </Link>
                    </td>

                    <td>{owner?.name ?? vm.ownerId}</td>
                    <td>{template?.name ?? vm.templateId}</td>

                    <td>
                      <Badge status={vm.status as VMStatus}>{vm.status}</Badge>
                    </td>

                    <td>
                      <MetricCell value={vm.cpuUsagePercent} />
                    </td>

                    <td>
                      <MetricCell
                        value={vm.memoryUsagePercent}
                        progressClassName="progress-memory"
                        indicatorClassName="bg-chart-memory"
                      />
                    </td>

                    <td className="tabular-nums">{Math.round(vm.diskUsagePercent)}%</td>

                    <td className="tabular-nums">{formatCurrency(vm.hourlyCost)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
