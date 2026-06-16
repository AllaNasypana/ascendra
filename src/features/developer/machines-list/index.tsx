'use client';

import type { FC } from 'react';
import { Skeleton } from '@/components/ui';
import { QueryErrorPanel } from '@/components/shared';
import { VmCardActions } from '@/features/developer/machines-list/vm-card-actions';
import { useUserMachines } from '@/features/developer/machines-list/use-user-machines';

export const MachinesList: FC = () => {
  const { vms, templates, isLoading, isError, refetch } = useUserMachines();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <QueryErrorPanel message="Failed to load machines." onRetry={() => refetch()} />;
  }

  if (vms.length === 0) {
    return (
      <div className="state-panel">
        <p className="text-lg font-medium">No machines yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact your admin to provision a developer workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vms.map((vm) => (
        <VmCardActions key={vm.id} vm={vm} templates={templates} />
      ))}
    </div>
  );
};
