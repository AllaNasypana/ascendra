import { z } from "zod";

export const templateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim(),
  baseImage: z.string().trim().min(1, "Base image is required"),
  vCpu: z.number().min(1).max(64),
  memoryGb: z.number().min(1).max(512),
  diskSizeGb: z.number().min(10).max(2000),
  preinstalledTools: z.string().trim(),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;