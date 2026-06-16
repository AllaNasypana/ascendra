'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui';
import { api } from '@/lib/api-client';
import type { VMTemplate } from '@/types';
import { TemplateCard } from '@/components/template/template-card';
import { TemplateFormDialog } from './template-form-dialog';
import { TemplatesSkeleton } from './templates-skeleton';

export const TemplatesManager: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VMTemplate>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['templates'],
    queryFn: api.templates.list,
  });

  const openCreateDialog = () => {
    setEditingTemplate(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (template: VMTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  if (isLoading) {
    return <TemplatesSkeleton />;
  }

  if (isError) {
    return (
      <div className="state-panel">
        <p className="text-muted-foreground">Failed to load templates.</p>

        <Button type="button" onClick={() => refetch()} className="state-panel-action">
          Retry
        </Button>
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

        <Button onClick={openCreateDialog}>
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
            <TemplateCard key={template.id} template={template} onEdit={openEditDialog} />
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
