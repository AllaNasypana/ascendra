'use client';

import type { FC } from 'react';
import { FiExternalLink, FiPlay, FiRefreshCw, FiSquare } from 'react-icons/fi';
import { Button } from '@/components/ui';
import { cn } from '@/utils';
import { EVMStatus, type VM } from '@/types';

interface VmActionButtonsProps {
  vm: VM;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  isPending?: boolean;
  size?: 'default' | 'sm';
}

export const VmActionButtons: FC<VmActionButtonsProps> = ({
  vm,
  onStart,
  onStop,
  onRestart,
  isPending = false,
  size = 'default',
}) => {
  const isTransitioning = vm.status === EVMStatus.STARTING || vm.status === EVMStatus.STOPPING;

  return (
    <>
      {vm.status === EVMStatus.RUNNING && (
        <>
          <Button asChild size={size} variant="default">
            <a href={vm.ideUrl} target="_blank" rel="noopener noreferrer">
              <FiExternalLink />
              Open in IDE
            </a>
          </Button>
          {onStop && (
            <Button size={size} variant="outline" onClick={onStop} disabled={isPending}>
              <FiSquare />
              Stop
            </Button>
          )}
          {onRestart && (
            <Button size={size} variant="ghost" onClick={onRestart} disabled={isPending}>
              <FiRefreshCw className={cn(isPending && 'animate-spin')} />
              Restart
            </Button>
          )}
        </>
      )}
      {vm.status === EVMStatus.STOPPED && onStart && (
        <Button size={size} onClick={onStart} disabled={isPending}>
          <FiPlay />
          Start
        </Button>
      )}
      {isTransitioning && (
        <span className="transition-label text-sm">
          <FiRefreshCw className="mr-1 h-4 w-4 animate-spin" />
          {vm.status === EVMStatus.STARTING ? 'Starting…' : 'Stopping…'}
        </span>
      )}
    </>
  );
};
