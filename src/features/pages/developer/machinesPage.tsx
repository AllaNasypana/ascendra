import { MachinesList } from "@/features/developer/machines-list";
import { FC } from "react";



export const MachinesPageView: FC = () => {
  return (
    <div className="space-y-6">
  <header className="page-header">
    <h1 className="page-title">My Machines</h1>
    <p className="page-description">Manage your developer workspaces</p>
  </header>
  <MachinesList />
</div>
  )
};