'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import type { VMTemplate } from '@/types';
import type { TemplateFormValues } from '@/lib/schemas';
import { getErrorMessage } from '@/utils/errors';
import { toTemplatePayload } from './template-mappers';

interface UseTemplateFormParams {
  template?: VMTemplate;
  onSuccess: () => void;
}

export const useTemplateForm = ({ template, onSuccess }: UseTemplateFormParams) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(template);

  const invalidateTemplates = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
  };

  const createMutation = useMutation({
    mutationFn: (data: TemplateFormValues) => api.templates.create(toTemplatePayload(data)),
    onSuccess: () => {
      toast.success('Template created');
      invalidateTemplates();
      onSuccess();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Failed to create template')),
  });

  const updateMutation = useMutation({
    mutationFn: (data: TemplateFormValues) => {
      if (!template) {
        throw new Error('Template is required for update');
      }

      return api.templates.update(template.id, toTemplatePayload(data));
    },
    onSuccess: () => {
      toast.success('Template updated');
      invalidateTemplates();
      onSuccess();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Failed to update template')),
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
