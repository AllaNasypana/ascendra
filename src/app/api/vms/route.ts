import { NextResponse } from 'next/server';
import { listVms, simulateDelay } from '@/utils';

export async function GET(request: Request) {
  await simulateDelay();
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId') ?? undefined;

  return NextResponse.json({ vms: listVms(ownerId) });
}
