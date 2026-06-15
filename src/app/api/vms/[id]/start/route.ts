import { NextResponse } from "next/server";
import { EVMStatus } from "@/types";
import { transitionVm } from "@/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await transitionVm(
    id,
    [EVMStatus.STOPPED, EVMStatus.ERROR],
    EVMStatus.STARTING,
    EVMStatus.RUNNING,
    1500
  );

  if (!result) {
    return NextResponse.json({ error: "VM not found" }, { status: 404 });
  }

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
