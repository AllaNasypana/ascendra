import type { FC, HTMLAttributes } from 'react';
import { cn } from '@/utils';

export const Skeleton: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
);
