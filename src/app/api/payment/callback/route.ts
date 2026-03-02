// app/api/payment/callback/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // TODO: هنا سجّل الـpayload في DB/Logs
    console.log("[PayTabs Callback] payload:", JSON.stringify(payload, null, 2));

    // ⚠️ مهم: لا تعتمد على هذا فقط. اعمل query بالـtran_ref للتأكيد النهائي.

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "callback error" }, { status: 500 });
  }
}

