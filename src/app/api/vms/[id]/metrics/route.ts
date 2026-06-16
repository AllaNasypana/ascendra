import { NextResponse } from 'next/server';
import type { RouteParams } from '@/lib/api/route-types';
import { getMetricPointsForVm, getVmById, simulateDelay } from '@/utils';

export async function GET(_request: Request, { params }: RouteParams) {
  await simulateDelay();
  const { id } = await params;

  if (!getVmById(id)) {
    return NextResponse.json({ error: 'VM not found' }, { status: 404 });
  }

  return NextResponse.json({ metrics: getMetricPointsForVm(id) });
}
