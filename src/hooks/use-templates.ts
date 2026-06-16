'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { createMapById } from '@/utils/collection';
import type { VMTemplate } from '@/types';

export function useTemplates() {
  const query = useQuery({
    queryKey: queryKeys.templates.list,
    queryFn: () => api.templates.list(),
  });

  const templatesById = createMapById(query.data?.templates ?? []);

  const getTemplate = (templateId: string): VMTemplate | undefined => templatesById.get(templateId);

  return {
    ...query,
    templates: query.data?.templates ?? [],
    templatesById,
    getTemplate,
  };
}
