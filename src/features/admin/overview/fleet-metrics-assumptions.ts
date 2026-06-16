/**
 * Documented assumptions for mocked fleet metrics.
 * Production would source these from billing, metrics stores, and identity systems.
 */
export const FLEET_METRICS_ASSUMPTIONS = {
  /**
   * Utilization (avg/peak CPU and memory) is averaged across **running VMs only**.
   * Stopped VMs contribute 0% usage and are excluded so fleet health reflects active load.
   */
  utilizationScope: 'running-vms-only' as const,

  /**
   * Hourly, month-to-date, and projected monthly cost sum **running VMs only**.
   * Stopped VMs incur no runtime cost in this mock.
   */
  costScope: 'running-vms-only' as const,

  /**
   * `totalUsers` counts **engineer** accounts only — admins are excluded because
   * they manage infrastructure but do not consume developer workspaces.
   */
  userScope: 'engineers-only' as const,

  /**
   * `stoppedVms` counts VMs in `stopped` status. Starting, stopping, and error VMs
   * are included in `totalVms` but not in running or stopped counts.
   */
  stoppedScope: 'stopped-status-only' as const,

  /** Mock billing: assume today is day 13 of the calendar month for MTD cost. */
  monthToDateDayOfMonth: 13,

  /** Projected monthly cost = totalHourlyCost × 24 hours × 30 days. */
  projectedMonthlyDays: 30,

  /** Hours of synthetic trend data returned for the fleet utilization chart. */
  utilizationTrendHours: 24,

  /**
   * The 24h utilization trend uses a sine-wave mock — not real historical telemetry.
   * Production would aggregate MetricPoint time series from a metrics backend.
   */
  utilizationTrendSource: 'synthetic-sine-wave' as const,
} as const;

export const FLEET_METRIC_DESCRIPTIONS = {
  totalVms: 'All developer machines in the fleet, every status.',
  runningVms: 'Machines currently online and billable.',
  stoppedVms: 'Machines powered off — no runtime utilization or hourly cost.',
  totalUsers: 'Engineers with workspace access (admins excluded).',
  avgCpuUtilization: 'Mean CPU % across running VMs — fleet capacity pressure.',
  peakCpuUtilization: 'Highest CPU % among running VMs — worst-case load.',
  avgMemoryUtilization: 'Mean memory % across running VMs.',
  peakMemoryUtilization: 'Highest memory % among running VMs.',
  totalHourlyCost: 'Sum of hourly rates for all running VMs (USD/hr).',
  monthToDateCost: 'Estimated spend so far this month based on current run rate.',
  projectedMonthlyCost: 'Run-rate projection if current usage continues all month.',
  utilizationTrend: '24-hour fleet CPU and memory trend for spotting patterns.',
  idleVms: 'Running VMs with low CPU (<5%) and no activity for 30+ minutes.',
  hotVms: 'Running VMs with CPU ≥80% or memory ≥85% — potential overload.',
} as const;
