import { NextResponse } from 'next/server';
import { createTemplate, listTemplates, simulateDelay } from '@/utils';
import type { VMTemplate } from '@/types';

export async function GET() {
  await simulateDelay();
  return NextResponse.json({ templates: listTemplates() });
}

export async function POST(request: Request) {
  await simulateDelay();
  const body = (await request.json()) as Omit<VMTemplate, 'id'>;

  if (!body.name || !body.baseImage) {
    return NextResponse.json({ error: 'Name and base image required' }, { status: 400 });
  }

  const template = createTemplate({
    id: `tpl-${Date.now()}`,
    name: body.name,
    description: body.description ?? '',
    baseImage: body.baseImage,
    vCpu: body.vCpu ?? 4,
    memoryGb: body.memoryGb ?? 16,
    diskSizeGb: body.diskSizeGb ?? 100,
    preinstalledTools: body.preinstalledTools ?? [],
  });

  return NextResponse.json({ template }, { status: 201 });
}
