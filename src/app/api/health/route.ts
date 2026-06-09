import {
  BACKEND_HEALTH_STATUS_UP,
  checkBackendHealth,
} from "@/lib/health";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isUp, status } = await checkBackendHealth();

  return NextResponse.json(
    {
      status: isUp ? BACKEND_HEALTH_STATUS_UP : "DOWN",
      backendStatus: status,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
