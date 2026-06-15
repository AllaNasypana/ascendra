"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import type { FC } from "react";
import { api } from "@/lib/api-client";
import {
  Badge,
  Input,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/components/ui";
import { cn, formatCurrency, isIdleVm } from "@/utils";
import type { PublicUser, VMStatus } from "@/types";
import { EVMStatus } from "@/types";
import type { VMTemplate } from "@/types";

export const VmInventory: FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VMStatus | "all">("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["vms"],
    queryFn: () => api.vms.list(),
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.users.list(),
  });

  const { data: templatesData } = useQuery({
    queryKey: ["templates"],
    queryFn: () => api.templates.list(),
  });

  const usersById = useMemo(() => {
    const map = new Map<string, PublicUser>();
    for (const user of usersData?.users ?? []) {
      map.set(user.id, user);
    }
    return map;
  }, [usersData]);

  const templatesById = useMemo(() => {
    const map = new Map<string, VMTemplate>();
    for (const template of templatesData?.templates ?? []) {
      map.set(template.id, template);
    }
    return map;
  }, [templatesData]);

  const filtered = useMemo(() => {
    const vms = data?.vms ?? [];
    return vms.filter((vm) => {
      const owner = usersById.get(vm.ownerId);
      const matchSearch =
        !search ||
        vm.name.toLowerCase().includes(search.toLowerCase()) ||
        owner?.name.toLowerCase().includes(search.toLowerCase()) ||
        owner?.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || vm.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter, usersById]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  if (isError) {
    return (
      <div className="state-panel">
        <p className="text-muted-foreground">Failed to load inventory.</p>
        <button type="button" onClick={() => refetch()} className="state-panel-action">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="page-header">
        <h1 className="page-title">VM Inventory</h1>
        <p className="page-description">
          {filtered.length} of {data?.vms.length ?? 0} machines
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder="Search by name or owner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search VMs"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as VMStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={EVMStatus.RUNNING}>Running</SelectItem>
            <SelectItem value={EVMStatus.STOPPED}>Stopped</SelectItem>
            <SelectItem value={EVMStatus.STARTING}>Starting</SelectItem>
            <SelectItem value={EVMStatus.ERROR}>Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Owner</th>
              <th scope="col">Template</th>
              <th scope="col">Status</th>
              <th scope="col">CPU</th>
              <th scope="col">Memory</th>
              <th scope="col">Disk</th>
              <th scope="col">Cost/hr</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="data-table-empty">
                  No VMs match your filters
                </td>
              </tr>
            ) : (
              filtered.map((vm) => {
                const owner = usersById.get(vm.ownerId);
                const template = templatesById.get(vm.templateId);
                const idle =
                  vm.status === EVMStatus.RUNNING &&
                  isIdleVm(vm.lastActiveAt, vm.cpuUsagePercent);

                return (
                  <tr
                    key={vm.id}
                    className={cn(idle && "alert-idle-row")}
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{vm.name}</span>
                        {idle && <span className="idle-tag">Idle</span>}
                      </div>
                    </td>
                    <td>{owner?.name ?? vm.ownerId}</td>
                    <td>{template?.name ?? vm.templateId}</td>
                    <td>
                      <Badge status={vm.status as VMStatus}>{vm.status}</Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Progress value={vm.cpuUsagePercent} className="h-1.5 w-16" />
                        <span className="tabular-nums">{Math.round(vm.cpuUsagePercent)}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={vm.memoryUsagePercent}
                          className="progress-memory h-1.5 w-16"
                          indicatorClassName="bg-chart-memory"
                        />
                        <span className="tabular-nums">{Math.round(vm.memoryUsagePercent)}%</span>
                      </div>
                    </td>
                    <td className="tabular-nums">{Math.round(vm.diskUsagePercent)}%</td>
                    <td className="tabular-nums">{formatCurrency(vm.hourlyCost)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
