// app/api/payment/query/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { tran_ref } = await req.json();

    if (!tran_ref) {
      return NextResponse.json({ error: "tran_ref required" }, { status: 400 });
    }

    const res = await fetch(`${process.env.PAYTABS_BASE_URL || "https://secure.paytabs.sa"}/payment/query`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: String(process.env.PAYTABS_SERVER_KEY || ""),
      },
      body: JSON.stringify({
        profile_id: Number(process.env.PAYTABS_PROFILE_ID || ""),
        tran_ref,
      }),
    });

    const data = await res.json();
    console.log("PayTabs Query Response:", JSON.stringify(data, null, 2));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "query error" }, { status: 500 });
  }
}

