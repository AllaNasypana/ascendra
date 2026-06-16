'use client';

import type { FC } from 'react';
import { Skeleton } from '@/components/ui';
import { VmCardActions } from '@/features/developer/machines-list/vm-card-actions';
import { useUserMachines } from '@/features/developer/machines-list/use-user-machines';

export const MachinesList: FC = () => {
  const { vms, templates, isLoading, isError, refetch } = useUserMachines();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="state-panel">
        <p className="text-muted-foreground">Failed to load machines.</p>
        <button type="button" onClick={() => refetch()} className="state-panel-action">
          Retry
        </button>
      </div>
    );
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