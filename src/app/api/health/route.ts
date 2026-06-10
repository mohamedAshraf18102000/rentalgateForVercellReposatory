import {
  BACKEND_HEALTH_STATUS_UP,
  getCachedBackendHealth,
} from "@/lib/health";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Use the module-level 30 s cache so that every client health poll
  // (BackendHealthWatcher, LocateMaintenancePage retry) does NOT make a
  // fresh TCP connection to the backend. Multiple simultaneous callers
  // within the same 30 s window share a single backend request.
  const isUp = await getCachedBackendHealth();

  return NextResponse.json(
    { status: isUp ? BACKEND_HEALTH_STATUS_UP : "DOWN" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
