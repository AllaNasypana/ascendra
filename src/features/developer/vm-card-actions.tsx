import type { FC } from 'react';
import { VM, VMTemplate } from '@/types';
import { useVmActions } from "@/features/developer/use-vm-actions";
import { VmCard } from '@/components/vm/vm-card';


interface VmCardActionsProps {
    vm: VM;
  templates: VMTemplate[];
}

export const VmCardActions: FC<VmCardActionsProps> = ({ vm, templates }) => {
    const actions = useVmActions(vm.id);
    const template = templates.find((t) => t.id === vm.templateId);
  
    return (
      <VmCard
        vm={vm}
        template={template}
        onStart={actions.start}
        onStop={actions.stop}
        onRestart={actions.restart}
        isActionPending={actions.isPending}
      />
    );
};