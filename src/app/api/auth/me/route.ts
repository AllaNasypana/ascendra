import { NextResponse } from 'next/server';
import { getUserById, simulateDelay, toPublicUser } from '@/utils';
import { CURRENT_USER_ID } from '@/constants';

export const GET = async (request: Request): Promise<NextResponse> => {
  await simulateDelay(200);
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get(CURRENT_USER_ID);

  if (!userId) {
    return NextResponse.json({ error: 'user Id required' }, { status: 400 });
  }

  const user = getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(user) });
};
