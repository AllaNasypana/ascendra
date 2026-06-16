'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiExternalLink, FiPlay, FiSquare, FiRefreshCw } from 'react-icons/fi';
import { UtilizationChart } from '@/components/charts';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { useVmActions } from '@/features/developer/vm-detail/use-vm-actions';
import { cn, formatCurrency, formatRelativeTime, formatUptime } from '@/utils';
import { EVMStatus } from '@/types';
import { useVm } from '@/features/developer/vm-detail/use-vm';

interface VmDetailProps {
  vmId: string;
  isAdmin?: boolean;
}

export const VmDetail: FC<VmDetailProps> = ({ vmId, isAdmin = false }) => {
  const actions = useVmActions(vmId);

  const { vm, template, chartData, isTransitioning, metricsLoading, vmLoading } = useVm(vmId);

  if (vmLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!vm) {
    return <p className="text-muted-foreground">Machine not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="./" className="text-muted-foreground hover:text-foreground">
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{vm.name}</h1>
            <Badge status={vm.status}>{vm.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {template?.name} · {vm.region}
          </p>
        </div>

        {!isAdmin && (
          <div className="flex gap-2">
            {vm.status === EVMStatus.RUNNING && (
              <>
                <Button asChild>
                  <a href={vm.ideUrl} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink />
                    Open in IDE
                  </a>
                </Button>
                <Button variant="outline" onClick={actions.stop} disabled={actions.isPending}>
                  <FiSquare />
                  Stop
                </Button>
                <Button variant="ghost" onClick={actions.restart} disabled={actions.isPending}>
                  <FiRefreshCw className={cn(actions.isPending && 'animate-spin')} />
                  Restart
                </Button>
              </>
            )}
            {vm.status === EVMStatus.STOPPED && (
              <Button onClick={actions.start} disabled={actions.isPending}>
                <FiPlay />
                Start
              </Button>
            )}
            {isTransitioning && (
              <span className="transition-label text-sm">
                <FiRefreshCw className="mr-1 h-4 w-4 animate-spin" />
                {vm.status === EVMStatus.STARTING ? 'Starting…' : 'Stopping…'}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatUptime(vm.startedAt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CPU</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(vm.cpuUsagePercent)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Memory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(vm.memoryUsagePercent)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(vm.hourlyCost)}/hr</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Usage (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : chartData.length > 0 ? (
              <UtilizationChart data={chartData} />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No metrics available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Template</span>
              <span>{template?.name ?? vm.templateId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">vCPU</span>
              <span>{template?.vCpu ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Memory</span>
              <span>{template ? `${template.memoryGb} GB` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Disk</span>
              <span>
                {template ? `${template.diskSizeGb} GB` : '—'} · {Math.round(vm.diskUsagePercent)}%
                used
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base image</span>
              <span>{template?.baseImage ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last active</span>
              <span>{formatRelativeTime(vm.lastActiveAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(vm.createdAt).toLocaleDateString()}</span>
            </div>
            {template?.preinstalledTools && (
              <div>
                <span className="text-muted-foreground">Tools</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {template.preinstalledTools.map((tool) => (
                    <span key={tool} className="rounded bg-muted px-2 py-0.5 text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
