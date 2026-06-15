export const EVMStatus = {
  RUNNING: "running",
  STOPPED: "stopped",
  STARTING: "starting",
  STOPPING: "stopping",
  ERROR: "error",
} as const;

export type VMStatus = (typeof EVMStatus)[keyof typeof EVMStatus];

export interface VM {
  id: string;
  name: string;
  ownerId: string;
  templateId: string;
  status: VMStatus;
  region: string;
  createdAt: string;
  startedAt: string | null;
  lastActiveAt: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskUsagePercent: number;
  hourlyCost: number;
  ideUrl: string;
}

export interface MetricPoint {
  timestamp: string;
  cpuPercent: number;
  memoryPercent: number;
}

export interface Policy {
  id: string;
  name: string;
  maxVmsPerUser: number;
  idleTimeoutMinutes: number;
  allowedTemplateIds: string[];
  appliesToTeam?: string;
  createdAt: string;
}

export interface FleetUtilization {
  period: "real-time" | "last-24-hours" | "last-30-days";
  totalVms: number;
  runningVms: number;
  stoppedVms: number;
  totalUsers: number;
  avgCpuUtilizationPercent: number;
  peakCpuUtilizationPercent: number;
  avgMemoryUtilizationPercent: number;
  peakMemoryUtilizationPercent: number;
  totalHourlyCost: number;
  monthToDateCost: number;
  projectedMonthlyCost: number;
  utilizationTrend: {
    timestamp: string;
    cpuPercent: number;
    memoryPercent: number;
    runningVms: number;
  }[];
  vmMetrics: {
    vmId: string;
    cpuPercent: number;
    memoryPercent: number;
    diskPercent: number;
    status: VMStatus;
  }[];
}
