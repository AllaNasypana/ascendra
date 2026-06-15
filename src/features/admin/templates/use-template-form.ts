"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "@/lib/api-client";
import type { VMTemplate } from "@/types";

import type { TemplateFormValues } from "@/lib/schemas";
import { toTemplatePayload } from "./template-mappers";

interface UseTemplateFormParams {
  template?: VMTemplate;
  onSuccess: () => void;
}

export const useTemplateForm = ({
  template,
  onSuccess,
}: UseTemplateFormParams) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(template);

  const createMutation = useMutation({
    mutationFn: (data: TemplateFormValues) =>
      api.templates.create(toTemplatePayload(data)),
    onSuccess: () => {
      toast.success("Template created");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      onSuccess();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: TemplateFormValues) => {
      if (!template) {
        throw new Error("Template is required for update");
      }

      return api.templates.update(template.id, toTemplatePayload(data));
    },
    onSuccess: () => {
      toast.success("Template updated");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      onSuccess();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const submitTemplate = (data: TemplateFormValues) => {
    if (isEdit) {
      updateMutation.mutate(data);
      return;
    }

    createMutation.mutate(data);
  };

  return {
    isEdit,
    isPending: createMutation.isPending || updateMutation.isPending,
    submitTemplate,
  };
};