export interface VMTemplate {
  id: string;
  name: string;
  description: string;
  baseImage: string;
  vCpu: number;
  memoryGb: number;
  diskSizeGb: number;
  preinstalledTools: string[];
}
