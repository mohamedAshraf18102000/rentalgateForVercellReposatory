"use client";

import { API_UNAVAILABLE_MESSAGE } from "@/lib/api/api-error";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    if (error.message !== API_UNAVAILABLE_MESSAGE) return;

    // The parent locale layout (and therefore BackendHealthWatcher) remains
    // mounted when this error boundary is shown. Dispatching the maintenance
    // event lets BackendHealthWatcher perform a deduplicated health check and
    // navigate via router.replace — no hard page reload.
    // Fallback: navigate directly in case BackendHealthWatcher is somehow
    // not yet mounted (e.g. very early hydration failure).
    const locale =
      window.location.pathname.split("/").filter(Boolean)[0] || "ar";
    router.replace(`/${locale}/maintenance`);
  }, [error, router]);

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
        onClick={reset}
      >
        إعادة المحاولة
      </button>
    </section>
  );
}
