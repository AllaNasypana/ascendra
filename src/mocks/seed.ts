import type { User, VMTemplate, VM, MetricPoint, Policy } from "@/types";
import { EVMStatus } from "@/types";

type SeedUser = Omit<User, "passwordHash">;

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

export const seedUsers: SeedUser[] = [
  {
    id: "user-1",
    name: "Alex Chen",
    email: "alex.chen@ascendra.io",
    role: "engineer",
  },
  {
    id: "user-2",
    name: "Jordan Lee",
    email: "jordan.lee@ascendra.io",
    role: "engineer",
  },
  {
    id: "user-3",
    name: "Sam Rivera",
    email: "sam.rivera@ascendra.io",
    role: "engineer",
  },
  {
    id: "user-4",
    name: "Morgan Patel",
    email: "morgan.patel@ascendra.io",
    role: "engineer",
  },
  {
    id: "admin-1",
    name: "Taylor Admin",
    email: "taylor.admin@ascendra.io",
    role: "admin",
  },
];

export const seedTemplates: VMTemplate[] = [
  {
    id: "tpl-1",
    name: "Standard Dev",
    description: "Balanced environment for everyday development",
    baseImage: "ubuntu-22.04",
    vCpu: 4,
    memoryGb: 16,
    diskSizeGb: 100,
    preinstalledTools: ["vscode-server", "docker", "node", "git"],
  },
  {
    id: "tpl-2",
    name: "Power User",
    description: "High-performance machine for heavy workloads",
    baseImage: "ubuntu-22.04",
    vCpu: 8,
    memoryGb: 32,
    diskSizeGb: 200,
    preinstalledTools: ["vscode-server", "docker", "node", "go", "rust"],
  },
  {
    id: "tpl-3",
    name: "Lightweight",
    description: "Minimal footprint for quick tasks and reviews",
    baseImage: "ubuntu-22.04",
    vCpu: 2,
    memoryGb: 8,
    diskSizeGb: 50,
    preinstalledTools: ["vscode-server", "git"],
  },
  {
    id: "tpl-4",
    name: "ML Workstation",
    description: "GPU-ready template for ML experimentation",
    baseImage: "ubuntu-22.04",
    vCpu: 16,
    memoryGb: 64,
    diskSizeGb: 500,
    preinstalledTools: ["vscode-server", "docker", "python", "jupyter"],
  },
];

export const seedVms: VM[] = [
  {
    id: "vm-1",
    name: "alex-main",
    ownerId: "user-1",
    templateId: "tpl-2",
    status: EVMStatus.RUNNING,
    region: "us-east-1",
    createdAt: daysAgo(45),
    startedAt: hoursAgo(6),
    lastActiveAt: hoursAgo(0.1),
    cpuUsagePercent: 42,
    memoryUsagePercent: 68,
    diskUsagePercent: 55,
    hourlyCost: 0.48,
    ideUrl: "https://vscode.example.com/vm-1",
  },
  {
    id: "vm-2",
    name: "alex-sidecar",
    ownerId: "user-1",
    templateId: "tpl-3",
    status: EVMStatus.STOPPED,
    region: "us-east-1",
    createdAt: daysAgo(20),
    startedAt: null,
    lastActiveAt: daysAgo(3),
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
    diskUsagePercent: 32,
    hourlyCost: 0.12,
    ideUrl: "https://vscode.example.com/vm-2",
  },
  {
    id: "vm-3",
    name: "jordan-frontend",
    ownerId: "user-2",
    templateId: "tpl-1",
    status: EVMStatus.RUNNING,
    region: "us-west-2",
    createdAt: daysAgo(30),
    startedAt: hoursAgo(12),
    lastActiveAt: hoursAgo(0.05),
    cpuUsagePercent: 78,
    memoryUsagePercent: 82,
    diskUsagePercent: 61,
    hourlyCost: 0.24,
    ideUrl: "https://vscode.example.com/vm-3",
  },
  {
    id: "vm-4",
    name: "jordan-experiments",
    ownerId: "user-2",
    templateId: "tpl-4",
    status: EVMStatus.RUNNING,
    region: "us-west-2",
    createdAt: daysAgo(10),
    startedAt: hoursAgo(2),
    lastActiveAt: hoursAgo(0.02),
    cpuUsagePercent: 91,
    memoryUsagePercent: 88,
    diskUsagePercent: 74,
    hourlyCost: 1.2,
    ideUrl: "https://vscode.example.com/vm-4",
  },
  {
    id: "vm-5",
    name: "sam-backend",
    ownerId: "user-3",
    templateId: "tpl-1",
    status: EVMStatus.RUNNING,
    region: "eu-west-1",
    createdAt: daysAgo(60),
    startedAt: hoursAgo(48),
    lastActiveAt: daysAgo(2),
    cpuUsagePercent: 3,
    memoryUsagePercent: 12,
    diskUsagePercent: 45,
    hourlyCost: 0.24,
    ideUrl: "https://vscode.example.com/vm-5",
  },
  {
    id: "vm-6",
    name: "sam-staging",
    ownerId: "user-3",
    templateId: "tpl-3",
    status: EVMStatus.STOPPED,
    region: "eu-west-1",
    createdAt: daysAgo(15),
    startedAt: null,
    lastActiveAt: daysAgo(5),
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
    diskUsagePercent: 28,
    hourlyCost: 0.12,
    ideUrl: "https://vscode.example.com/vm-6",
  },
  {
    id: "vm-7",
    name: "morgan-api",
    ownerId: "user-4",
    templateId: "tpl-2",
    status: EVMStatus.RUNNING,
    region: "us-east-1",
    createdAt: daysAgo(25),
    startedAt: hoursAgo(8),
    lastActiveAt: hoursAgo(0.3),
    cpuUsagePercent: 55,
    memoryUsagePercent: 71,
    diskUsagePercent: 58,
    hourlyCost: 0.48,
    ideUrl: "https://vscode.example.com/vm-7",
  },
  {
    id: "vm-8",
    name: "morgan-review",
    ownerId: "user-4",
    templateId: "tpl-3",
    status: EVMStatus.ERROR,
    region: "us-east-1",
    createdAt: daysAgo(5),
    startedAt: null,
    lastActiveAt: daysAgo(1),
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
    diskUsagePercent: 15,
    hourlyCost: 0.12,
    ideUrl: "https://vscode.example.com/vm-8",
  },
];

export const seedPolicies: Policy[] = [
  {
    id: "pol-1",
    name: "Default Engineering Policy",
    maxVmsPerUser: 3,
    idleTimeoutMinutes: 120,
    allowedTemplateIds: ["tpl-1", "tpl-2", "tpl-3"],
    createdAt: daysAgo(90),
  },
  {
    id: "pol-2",
    name: "ML Team Policy",
    maxVmsPerUser: 2,
    idleTimeoutMinutes: 60,
    allowedTemplateIds: ["tpl-4"],
    appliesToTeam: "ml-platform",
    createdAt: daysAgo(60),
  },
];

function generateMetricPoints(baseCpu: number, baseMem: number): MetricPoint[] {
  const points: MetricPoint[] = [];
  for (let i = 23; i >= 0; i--) {
    const variance = Math.sin(i * 0.5) * 15 + Math.random() * 10;
    points.push({
      timestamp: hoursAgo(i),
      cpuPercent: Math.max(0, Math.min(100, baseCpu + variance)),
      memoryPercent: Math.max(0, Math.min(100, baseMem + variance * 0.6)),
    });
  }
  return points;
}

export const seedMetricPoints: Record<string, MetricPoint[]> = {
  "vm-1": generateMetricPoints(42, 68),
  "vm-2": generateMetricPoints(0, 0),
  "vm-3": generateMetricPoints(78, 82),
  "vm-4": generateMetricPoints(91, 88),
  "vm-5": generateMetricPoints(3, 12),
  "vm-6": generateMetricPoints(0, 0),
  "vm-7": generateMetricPoints(55, 71),
  "vm-8": generateMetricPoints(0, 0),
};
