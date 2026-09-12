import { NextResponse } from "next/server";
import { checkHealth } from "@/modules/nucleo";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkHealth();
  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}
