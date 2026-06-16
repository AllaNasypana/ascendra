import type { FC } from 'react';

interface OverviewHealthAlertsProps {
  idleCount: number;
  hotCount: number;
}

export const OverviewHealthAlerts: FC<OverviewHealthAlertsProps> = ({ idleCount, hotCount }) => (
  <>
    {idleCount > 0 && (
      <div className="alert-banner" role="status">
        {idleCount} running VM{idleCount > 1 ? 's' : ''} appear idle (CPU &lt;5%, inactive &gt;30m).
        Review in Inventory to reduce waste.
      </div>
    )}
    {hotCount > 0 && (
      <div className="alert-banner" role="status">
        {hotCount} running VM{hotCount > 1 ? 's' : ''} appear hot (CPU ≥80% or memory ≥85%).
        Consider resizing templates or investigating workload spikes.
      </div>
    )}
  </>
);
