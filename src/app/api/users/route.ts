import { NextResponse } from "next/server";
import { listUsers, simulateDelay, toPublicUser } from "@/utils";

export const GET = async (): Promise<NextResponse> => {
  await simulateDelay(200);
  return NextResponse.json({ users: listUsers().map(toPublicUser) });
};
