import { NextResponse } from 'next/server';
import { getVmById, simulateDelay } from '@/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  await simulateDelay();
  const { id } = await params;
  const vm = getVmById(id);

  if (!vm) {
    return NextResponse.json({ error: 'VM not found' }, { status: 404 });
  }

  return NextResponse.json({ vm });
}
