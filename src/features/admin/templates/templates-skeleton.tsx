import type { FC } from 'react';
import { Skeleton } from '@/components/ui';

export const TemplatesSkeleton: FC = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-48 rounded-xl" />
      ))}
    </div>
  );
};
