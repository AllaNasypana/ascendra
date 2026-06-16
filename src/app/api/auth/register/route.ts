import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, hashPassword, simulateDelay, toPublicUser } from '@/utils';
import { User, ERole } from '@/types';

export const POST = async (request: Request): Promise<NextResponse> => {
  await simulateDelay();
  const body = await request.json();
  const { name, email, password, role } = body as {
    name?: string;
    email?: string;
    password?: string;
    role?: User['role'];
  };

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  if (role !== ERole.ADMIN && role !== ERole.ENGINEER) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const user = createUser({
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    passwordHash: hashPassword(password),
  });

  return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
};
