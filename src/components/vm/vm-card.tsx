"use client";

import type { FC } from "react";
import Link from "next/link";
import { FiExternalLink, FiPlay, FiSquare, FiRefreshCw } from "react-icons/fi";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn, formatCurrency, formatRelativeTime, isTransitionStatus } from "@/utils";
import { EVMStatus, type VM, type VMTemplate } from "@/types";
import { ResourceBar } from "./resource-bar";

interface VmCardProps {
  vm: VM;
  template?: VMTemplate;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  isActionPending?: boolean;
}



export const VmCard: FC<VmCardProps> = ({
  vm,
  template,
  onStart,
  onStop,
  onRestart,
  isActionPending,
}) => {
  const isTransitioning = isTransitionStatus(vm.status);
  const canConnect = vm.status === EVMStatus.RUNNING;
  const detailHref = `/machines/${vm.id}`;

  return (
    <Card
      className={cn(
        "group relative transition-colors hover:border-primary/40",
        isTransitioning && "opacity-80"
      )}
    >
      

      <CardHeader className="relative z-10 flex flex-row items-start justify-between space-y-0 pb-3 ">
        <div >
          <Link href={detailHref} className="flex hover:underline py-2">
          <CardTitle className="text-base group-hover:underline">{vm.name}</CardTitle>
          </Link>
          
          <p className="mt-1 text-xs text-muted-foreground">
            {template?.name ?? vm.templateId} · {vm.region}
          </p>
        </div>
        <Badge status={vm.status}>{vm.status}</Badge>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {vm.status === EVMStatus.RUNNING ? (
          <div className="pointer-events-none space-y-2">
            <ResourceBar label="CPU" value={vm.cpuUsagePercent} />
            <ResourceBar
              label="Memory"
              value={vm.memoryUsagePercent}
              color="bg-chart-memory"
            />
            <ResourceBar
              label="Disk"
              value={vm.diskUsagePercent}
              color="bg-chart-warning"
            />
          </div>
        ) : (
          <p className="pointer-events-none text-sm text-muted-foreground">
            Last active {formatRelativeTime(vm.lastActiveAt)}
          </p>
        )}

        <div className="relative z-20 flex flex-wrap gap-2 pointer-events-auto">
          {canConnect && (
            <Button asChild size="sm" variant="default">
              <a href={vm.ideUrl} target="_blank" rel="noopener noreferrer">
                <FiExternalLink />
                Open in IDE
              </a>
            </Button>
          )}
          {vm.status === EVMStatus.STOPPED && onStart && (
            <Button size="sm" variant="outline" onClick={onStart} disabled={isActionPending}>
              <FiPlay />
              Start
            </Button>
          )}
          {vm.status === EVMStatus.RUNNING && onStop && (
            <Button size="sm" variant="outline" onClick={onStop} disabled={isActionPending}>
              <FiSquare />
              Stop
            </Button>
          )}
          {vm.status === EVMStatus.RUNNING && onRestart && (
            <Button size="sm" variant="ghost" onClick={onRestart} disabled={isActionPending}>
              <FiRefreshCw className={cn(isActionPending && "animate-spin")} />
              Restart
            </Button>
          )}
          {isTransitioning && (
            <span className="transition-label">
              <FiRefreshCw className="mr-1 h-3 w-3 animate-spin" />
              {vm.status === EVMStatus.STARTING ? "Starting…" : "Stopping…"}
            </span>
          )}
        </div>

        <p className="pointer-events-none text-xs text-muted-foreground">
          {formatCurrency(vm.hourlyCost)}/hr
        </p>
      </CardContent>
    </Card>
  );
};
