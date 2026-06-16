'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { VmActionButtons } from '@/components/vm/vm-action-buttons';
import { cn, formatCurrency, formatRelativeTime, isTransitionStatus } from '@/utils';
import { EVMStatus, type VM, type VMTemplate } from '@/types';
import { ResourceBar } from './resource-bar';

interface VmCardProps {
  vm: VM;
  template?: VMTemplate;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  isActionPending?: boolean;
}

export const VmCard: FC<VmCardProps> = ({
  vm,
  template,
  onStart,
  onStop,
  onRestart,
  isActionPending,
}) => {
  const isTransitioning = isTransitionStatus(vm.status);
  const detailHref = `/machines/${vm.id}`;

  return (
    <Card
      className={cn(
        'group relative transition-colors hover:border-primary/40',
        isTransitioning && 'opacity-80',
      )}
    >
      <CardHeader className="relative z-10 flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <Link href={detailHref} className="flex py-2 hover:underline">
            <CardTitle className="text-base group-hover:underline">{vm.name}</CardTitle>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            {template?.name ?? vm.templateId} · {vm.region}
          </p>
        </div>
        <Badge status={vm.status}>{vm.status}</Badge>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {vm.status === EVMStatus.RUNNING ? (
          <div className="pointer-events-none space-y-2">
            <ResourceBar label="CPU" value={vm.cpuUsagePercent} />
            <ResourceBar label="Memory" value={vm.memoryUsagePercent} color="bg-chart-memory" />
            <ResourceBar label="Disk" value={vm.diskUsagePercent} color="bg-chart-warning" />
          </div>
        ) : (
          <p className="pointer-events-none text-sm text-muted-foreground">
            Last active {formatRelativeTime(vm.lastActiveAt)}
          </p>
        )}

        <div className="relative z-20 flex flex-wrap gap-2 pointer-events-auto">
          <VmActionButtons
            vm={vm}
            onStart={onStart}
            onStop={onStop}
            onRestart={onRestart}
            isPending={isActionPending}
            size="sm"
          />
        </div>

        <p className="pointer-events-none text-xs text-muted-foreground">
          {formatCurrency(vm.hourlyCost)}/hr
        </p>
      </CardContent>
    </Card>
  );
};
