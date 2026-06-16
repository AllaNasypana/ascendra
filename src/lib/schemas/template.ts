import { z } from 'zod';

export const templateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim(),
  baseImage: z.string().trim().min(1, 'Base image is required'),
  vCpu: z.number().min(1, 'Must be greater 1 vCPU').max(64, 'Must be less 64 vCPUs'),
  memoryGb: z.number().min(1, 'Must be greater 1 GB').max(512, 'Must be less 512 GB'),
  diskSizeGb: z.number().min(10, 'Must be greater 10 GB').max(2000, 'Must be less 2000 GB'  ),
  preinstalledTools: z.string().trim(),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;
