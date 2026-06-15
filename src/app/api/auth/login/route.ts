import { NextResponse } from "next/server";
import { getUserByEmail, simulateDelay, verifyPassword, toPublicUser } from "@/utils";

export const POST = async (request: Request): Promise<NextResponse> => {
  await simulateDelay();
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = getUserByEmail(email);


  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ user: toPublicUser(user) });
};
