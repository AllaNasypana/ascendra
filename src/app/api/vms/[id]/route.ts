import { NextResponse } from 'next/server';
import type { RouteParams } from '@/lib/api/route-types';
import { getVmById, simulateDelay } from '@/utils';

export async function GET(_request: Request, { params }: RouteParams) {
  await simulateDelay();
  const { id } = await params;
  const vm = getVmById(id);

  if (!vm) {
    return NextResponse.json({ error: 'VM not found' }, { status: 404 });
  }

  return NextResponse.json({ vm });
}
