// app/api/payment/create/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = process.env.PAYTABS_DEFAULT_CURRENCY || "SAR",
      cart_id,
      description,
      customer = {},
      return_params = "",
      return_url, // Optional custom return URL
      paypage_lang = process.env.PAYTABS_LANG || "ar",
    } = body || {};

    if (!amount) {
      return NextResponse.json({ error: "amount required" }, { status: 400 });
    }

    // بناء الـ return URL مع البيانات
    // إذا تم تحديد return_url مخصص، استخدمه، وإلا استخدم NEXT_PUBLIC_RETURN_URL
    const baseReturnUrl = return_url || process.env.NEXT_PUBLIC_RETURN_URL;
    const returnUrl = return_params 
      ? `${baseReturnUrl}?${return_params}`
      : baseReturnUrl;
    console.log('returnUrl', returnUrl);
    
    const payload = {
      profile_id: Number(process.env.PAYTABS_PROFILE_ID),
      tran_type: "sale",
      tran_class: "ecom",
      cart_id: String(cart_id),
      cart_description: description || "حجز سيارة",
      cart_currency: currency,
      cart_amount: Number(amount),
      return: returnUrl,
      callback: process.env.PAYTABS_CALLBACK_URL,
      paypage_lang,
      // بيانات العميل للفواتير (Billing)
      customer_details: {
        name: customer.name || "Guest",
        email: customer.email || "guest@example.com",
        phone: customer.phone || "",
        street1: customer.street1 || customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        country: customer.country || "SA",
        zip: customer.zip || "",
      },
      // بيانات الشحن (Shipping) - نفس بيانات الفواتير
      shipping_details: {
        name: customer.name || "Guest",
        email: customer.email || "guest@example.com",
        phone: customer.phone || "",
        street1: customer.street1 || customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        country: customer.country || "SA",
        zip: customer.zip || "",
      },
      // إعدادات إضافية لملء النموذج تلقائياً
      hide_shipping: true,
      hide_billing: true,
      framed: false,
      frameds: 0
    };

    // Debug logging
    console.log("📍 Return URL:", returnUrl);
    console.log("PayTabs Request Payload:", JSON.stringify(payload, null, 2));

    const res = await fetch(`${process.env.PAYTABS_BASE_URL || "https://secure.paytabs.sa"}/payment/request`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: String(process.env.PAYTABS_SERVER_KEY || ""),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // Debug logging
    console.log("PayTabs Response Status:", res.status);
    console.log("PayTabs Response Data:", JSON.stringify(data, null, 2));

    // PayTabs بيرجع: { redirect_url, tran_ref, ... }
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "server error" }, { status: 500 });
  }
}

