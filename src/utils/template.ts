import type { VMTemplate } from '@/types';
import { getStore } from '@/mocks/store';

export const getTemplateById = (id: string): VMTemplate | undefined =>
  getStore().templatesMap.get(id);

export const listTemplates = (): VMTemplate[] => getStore().templates;

export const createTemplate = (template: VMTemplate): VMTemplate => {
  const store = getStore();
  store.templates.push(template);
  store.templatesMap.set(template.id, template);
  return template;
};

export const updateTemplate = (
  id: string,
  patch: Partial<Omit<VMTemplate, 'id'>>,
): VMTemplate | undefined => {
  const store = getStore();
  const template = store.templatesMap.get(id);
  if (!template) return undefined;
  Object.assign(template, patch);
  store.templatesMap.set(id, template);
  return template;
};
