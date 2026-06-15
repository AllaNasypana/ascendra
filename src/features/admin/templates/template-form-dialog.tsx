"use client";

import type { FC } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { TextField } from "@/components/forms/form-fields/text-field";
import type { VMTemplate } from "@/types";

import {
  
  templateSchema,
  type TemplateFormValues,
} from "@/lib/schemas";
import { getTemplateDefaultValues, DEFAULT_TEMPLATE_VALUES } from "./template-mappers";
import { useTemplateForm } from "./use-template-form";

interface TemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: VMTemplate;
}

export const TemplateFormDialog: FC<TemplateFormDialogProps> = ({
  open,
  onOpenChange,
  template,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: getTemplateDefaultValues(template),
  });

  const { isEdit, isPending, submitTemplate } = useTemplateForm({
    template,
    onSuccess: () => {
      onOpenChange(false);
      reset(DEFAULT_TEMPLATE_VALUES);
    },
  });

  useEffect(() => {
    reset(getTemplateDefaultValues(template));
  }, [template, reset]);

  const closeDialog = () => {
    onOpenChange(false);
    reset(getTemplateDefaultValues(template));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Template" : "Create Template"}</DialogTitle>
          <DialogDescription>
            Define VM specs and preinstalled tools for developer workspaces.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submitTemplate)}
          className="space-y-4"
          noValidate
        >
          <TextField
            name="name"
            control={control}
            label="Name"
            error={errors.name?.message}
          />

          <TextField
            name="description"
            control={control}
            label="Description"
            error={errors.description?.message}
          />

          <TextField
            name="baseImage"
            control={control}
            label="Base Image"
            error={errors.baseImage?.message}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TextField
              name="vCpu"
              control={control}
              label="vCPU"
              type="number"
              error={errors.vCpu?.message}
            />

            <TextField
              name="memoryGb"
              control={control}
              label="Memory (GB)"
              type="number"
              error={errors.memoryGb?.message}
            />

            <TextField
              name="diskSizeGb"
              control={control}
              label="Disk (GB)"
              type="number"
              error={errors.diskSizeGb?.message}
            />
          </div>

          <TextField
            name="preinstalledTools"
            control={control}
            label="Preinstalled Tools"
            placeholder="vscode-server, docker, git"
            error={errors.preinstalledTools?.message}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeDialog}>
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
};