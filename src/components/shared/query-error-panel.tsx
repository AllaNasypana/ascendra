'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui';

interface QueryErrorPanelProps {
  message: string;
  onRetry: () => void;
}

export const QueryErrorPanel: FC<QueryErrorPanelProps> = ({ message, onRetry }) => (
  <div className="state-panel">
    <p className="text-muted-foreground">{message}</p>
    <Button type="button" onClick={onRetry} className="state-panel-action">
      Retry
    </Button>
  </div>
);
