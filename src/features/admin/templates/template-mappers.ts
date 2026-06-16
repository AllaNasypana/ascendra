import type { VMTemplate } from '@/types';
import { type TemplateFormValues } from '@/lib/schemas';

export const DEFAULT_TEMPLATE_VALUES: TemplateFormValues = {
  name: '',
  description: '',
  baseImage: 'ubuntu-22.04',
  vCpu: 4,
  memoryGb: 16,
  diskSizeGb: 100,
  preinstalledTools: 'vscode-server, docker, git',
};

export const getTemplateDefaultValues = (template?: VMTemplate): TemplateFormValues => {
  if (!template) return DEFAULT_TEMPLATE_VALUES;

  return {
    name: template.name,
    description: template.description,
    baseImage: template.baseImage,
    vCpu: template.vCpu,
    memoryGb: template.memoryGb,
    diskSizeGb: template.diskSizeGb,
    preinstalledTools: template.preinstalledTools.join(', '),
  };
};

export const toTemplatePayload = (data: TemplateFormValues): Omit<VMTemplate, 'id'> => ({
  name: data.name,
  description: data.description,
  baseImage: data.baseImage,
  vCpu: data.vCpu,
  memoryGb: data.memoryGb,
  diskSizeGb: data.diskSizeGb,
  preinstalledTools: data.preinstalledTools
    .split(',')
    .map((tool) => tool.trim())
    .filter(Boolean),
});
