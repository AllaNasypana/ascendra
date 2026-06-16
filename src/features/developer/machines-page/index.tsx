import type { FC } from 'react';
import { PageHeader } from '@/components/shared';
import { MachinesList } from '@/features/developer/machines-list';

export const MachinesPageView: FC = () => (
  <div className="space-y-6">
    <PageHeader title="My Machines" description="Manage your developer workspaces" />
    <MachinesList />
  </div>
);
