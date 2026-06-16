import { Progress } from '@/components/ui';
import { cn } from '@/utils';
import { FC } from 'react';

interface MetricCellProps {
  value: number;
  progressClassName?: string;
  indicatorClassName?: string;
}

export const MetricCell: FC<MetricCellProps> = ({
  value,
  progressClassName,
  indicatorClassName,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Progress
        value={value}
        className={cn('h-1.5 w-16', progressClassName)}
        indicatorClassName={indicatorClassName}
      />
      <span className="tabular-nums">{Math.round(value)}%</span>
    </div>
  );
};
