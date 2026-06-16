import { Progress } from '@/components/ui';
import { FC } from 'react';

interface ResourceBarProps {
  label: string;
  value: number;
  color?: string;
}

export const ResourceBar: FC<ResourceBarProps> = ({ label, value, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <Progress value={value} indicatorClassName={color} />
  </div>
);
