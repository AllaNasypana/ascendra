'use client';

import Link from 'next/link';
import type { FC } from 'react';
import { Badge } from '@/components/ui';
import { ROUTES } from '@/constants';
import type { InventoryItem } from '@/types/inventory';
import type { VMStatus } from '@/types';
import { cn, formatCurrency, isVmIdle } from '@/utils';
import type { InventorySortColumn, InventorySortDirection } from './inventory-sorting';
import { SortableHeader } from './sortable-header';
import { MetricCell } from './metric-cell';

interface InventoryTableProps {
  items: InventoryItem[];
  sortColumn: InventorySortColumn;
  sortDirection: InventorySortDirection;
  onSort: (column: InventorySortColumn) => void;
}

export const InventoryTable: FC<InventoryTableProps> = ({
  items,
  sortColumn,
  sortDirection,
  onSort,
}) => (
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
            onSort={onSort}
          />
          <SortableHeader
            label="Memory"
            column="memory"
            activeColumn={sortColumn}
            direction={sortDirection}
            onSort={onSort}
          />
          <SortableHeader
            label="Disk"
            column="disk"
            activeColumn={sortColumn}
            direction={sortDirection}
            onSort={onSort}
          />
          <SortableHeader
            label="Cost/hr"
            column="cost"
            activeColumn={sortColumn}
            direction={sortDirection}
            onSort={onSort}
          />
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={8} className="data-table-empty">
              No VMs match your filters
            </td>
          </tr>
        ) : (
          items.map(({ vm, owner, template }) => {
            const isIdle = isVmIdle(vm);

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
);
