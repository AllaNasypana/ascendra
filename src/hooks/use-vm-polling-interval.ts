import type { VMStatus } from '@/types';
import { isTransitionStatus } from '@/utils';

const TRANSITION_POLL_INTERVAL_MS = 2_000;
const DEFAULT_POLL_INTERVAL_MS = 30_000;

export function getVmPollingInterval(status: VMStatus | undefined): number | false {
  return status && isTransitionStatus(status)
    ? TRANSITION_POLL_INTERVAL_MS
    : DEFAULT_POLL_INTERVAL_MS;
}

export function getVmListPollingInterval(statuses: VMStatus[]): number | false {
  const hasTransition = statuses.some(isTransitionStatus);
  return hasTransition ? TRANSITION_POLL_INTERVAL_MS : DEFAULT_POLL_INTERVAL_MS;
}
