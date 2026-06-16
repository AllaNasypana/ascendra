import { NextResponse } from 'next/server';
import type { RouteParams } from '@/lib/api/route-types';
import { getTemplateById, simulateDelay, updateTemplate } from '@/utils';
import type { VMTemplate } from '@/types';

export async function GET(_request: Request, { params }: RouteParams) {
  await simulateDelay();
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  return NextResponse.json({ template });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  await simulateDelay();
  const { id } = await params;
  const body = (await request.json()) as Partial<Omit<VMTemplate, 'id'>>;
  const template = updateTemplate(id, body);

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  return NextResponse.json({ template });
}
