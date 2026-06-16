'use client';

import { Suspense, type FC } from 'react';
import { Skeleton } from '@/components/ui';
import { PageHeader, QueryErrorPanel } from '@/components/shared';
import { useInventory } from './use-inventory';
import { InventoryFilters } from './inventory-filters';
import { InventoryTable } from './inventory-table';

const InventoryContent: FC = () => {
  const {
    isLoading,
    isError,
    refetch,
    inventoryItems,
    totalVms,
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
    return <QueryErrorPanel message="Failed to load inventory." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="VM Inventory"
        description={`${inventoryItems.length} of ${totalVms} machines`}
      />

      <InventoryFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <InventoryTable
        items={inventoryItems}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={toggleSort}
      />
    </div>
  );
};

export const VmInventory: FC = () => (
  <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
    <InventoryContent />
  </Suspense>
);
