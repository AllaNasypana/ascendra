import { NextResponse } from 'next/server';
import { computeFleetUtilization, simulateDelay } from '@/utils';
import type { FleetUtilization } from '@/types';

export async function GET(request: Request) {
  await simulateDelay();
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') ?? 'real-time') as FleetUtilization['period'];

  const fleet = computeFleetUtilization(period);
  return NextResponse.json({ fleet });
}
