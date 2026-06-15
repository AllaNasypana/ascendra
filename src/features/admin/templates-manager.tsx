"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiEdit2, FiPlus } from "react-icons/fi";
import type { FC } from "react";
import { api } from "@/lib/api-client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Label,
  Skeleton,
} from "@/components/ui";
import type { VMTemplate } from "@/types";

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  baseImage: z.string().min(1, "Base image is required"),
  vCpu: z.number().min(1).max(64),
  memoryGb: z.number().min(1).max(512),
  diskSizeGb: z.number().min(10).max(2000),
  preinstalledTools: z.string(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

function TemplateFormDialog({
  open,
  onOpenChange,
  template,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: VMTemplate;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!template;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: template
      ? {
          name: template.name,
          description: template.description,
          baseImage: template.baseImage,
          vCpu: template.vCpu,
          memoryGb: template.memoryGb,
          diskSizeGb: template.diskSizeGb,
          preinstalledTools: template.preinstalledTools.join(", "),
        }
      : {
          name: "",
          description: "",
          baseImage: "ubuntu-22.04",
          vCpu: 4,
          memoryGb: 16,
          diskSizeGb: 100,
          preinstalledTools: "vscode-server, docker, git",
        },
  });

  const createMutation = useMutation({
    mutationFn: (data: TemplateFormValues) =>
      api.templates.create({
        name: data.name,
        description: data.description,
        baseImage: data.baseImage,
        vCpu: data.vCpu,
        memoryGb: data.memoryGb,
        diskSizeGb: data.diskSizeGb,
        preinstalledTools: data.preinstalledTools
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      toast.success("Template created");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      onOpenChange(false);
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: TemplateFormValues) =>
      api.templates.update(template!.id, {
        name: data.name,
        description: data.description,
        baseImage: data.baseImage,
        vCpu: data.vCpu,
        memoryGb: data.memoryGb,
        diskSizeGb: data.diskSizeGb,
        preinstalledTools: data.preinstalledTools
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      toast.success("Template updated");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      onOpenChange(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function onSubmit(data: TemplateFormValues) {
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data);
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Template" : "Create Template"}</DialogTitle>
          <DialogDescription>
            Define VM specs and preinstalled tools for developer workspaces.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseImage">Base Image</Label>
            <Input id="baseImage" {...register("baseImage")} />
            {errors.baseImage && (
              <p className="form-error">{errors.baseImage.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="vCpu">vCPU</Label>
              <Input
                id="vCpu"
                type="number"
                {...register("vCpu", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memoryGb">Memory (GB)</Label>
              <Input
                id="memoryGb"
                type="number"
                {...register("memoryGb", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diskSizeGb">Disk (GB)</Label>
              <Input
                id="diskSizeGb"
                type="number"
                {...register("diskSizeGb", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preinstalledTools">Preinstalled Tools (comma-separated)</Label>
            <Input id="preinstalledTools" {...register("preinstalledTools")} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Save Changes" : "Create Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const TemplatesManager: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VMTemplate | undefined>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: () => api.templates.list(),
  });

  function openCreate() {
    setEditingTemplate(undefined);
    setDialogOpen(true);
  }

  function openEdit(template: VMTemplate) {
    setEditingTemplate(template);
    setDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="state-panel">
        <p className="text-muted-foreground">Failed to load templates.</p>
        <button type="button" onClick={() => refetch()} className="state-panel-action">
          Retry
        </button>
      </div>
    );
  }

  const templates = data?.templates ?? [];

  return (
    <div className="space-y-6">
      <header className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">VM Templates</h1>
          <p className="page-description">{templates.length} templates configured</p>
        </div>
        <Button onClick={openCreate}>
          <FiPlus aria-hidden />
          New Template
        </Button>
      </header>

      {templates.length === 0 ? (
        <div className="state-panel">
          <p className="text-muted-foreground">No templates yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(template)}
                  aria-label={`Edit ${template.name}`}
                >
                  <FiEdit2 aria-hidden />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="spec-stat">
                    <p className="spec-stat-label">vCPU</p>
                    <p className="font-semibold tabular-nums">{template.vCpu}</p>
                  </div>
                  <div className="spec-stat">
                    <p className="spec-stat-label">RAM</p>
                    <p className="font-semibold tabular-nums">{template.memoryGb} GB</p>
                  </div>
                  <div className="spec-stat">
                    <p className="spec-stat-label">Disk</p>
                    <p className="font-semibold tabular-nums">{template.diskSizeGb} GB</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Base: <span className="text-foreground">{template.baseImage}</span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.preinstalledTools.map((tool) => (
                    <span key={tool} className="tool-tag">
                      {tool}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TemplateFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={editingTemplate}
      />
    </div>
  );
};
