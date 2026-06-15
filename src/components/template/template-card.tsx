import type { FC } from "react";
import { FiEdit2 } from "react-icons/fi";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { VMTemplate } from "@/types";
import { SpecStat } from "./spec-stat";

interface TemplateCardProps {
  template: VMTemplate;
  onEdit: (template: VMTemplate) => void;
}

export const TemplateCard: FC<TemplateCardProps> = ({ template, onEdit }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{template.name}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {template.description}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(template)}
          aria-label={`Edit ${template.name}`}
        >
          <FiEdit2 aria-hidden />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-2">
          <SpecStat label="vCPU" value={template.vCpu} />
          <SpecStat label="RAM" value={`${template.memoryGb} GB`} />
          <SpecStat label="Disk" value={`${template.diskSizeGb} GB`} />
        </div>

        <p className="text-muted-foreground">
          Base: <span className="text-foreground">{template.baseImage}</span>
        </p>

        <div className="flex flex-wrap gap-1">
          {template.preinstalledTools.map((tool) => (
            <span key={tool} className="tool-tag">
              {tool}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};