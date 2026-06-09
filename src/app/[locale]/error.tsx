"use client";

import { API_UNAVAILABLE_MESSAGE } from "@/lib/api/api-error";
import { redirectToMaintenanceClient } from "@/lib/api/client-redirect";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    if (error.message === API_UNAVAILABLE_MESSAGE) {
      redirectToMaintenanceClient();
    }
  }, [error]);

  if (error.message === API_UNAVAILABLE_MESSAGE) {
    return null;
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-bold">حدث خطأ غير متوقع</h2>
      <p className="max-w-md text-muted-foreground">
        يرجى المحاولة مرة أخرى. إذا استمرت المشكلة، تواصل مع الدعم.
      </p>
      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        onClick={() => window.location.reload()}
      >
        إعادة المحاولة
      </button>
    </section>
  );
}
