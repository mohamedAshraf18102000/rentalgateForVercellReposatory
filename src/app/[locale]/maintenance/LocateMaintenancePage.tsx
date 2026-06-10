"use client";

import { Button } from "@/app/(components)";
import { useBackendHealthPolling } from "@/hooks/useBackendHealthPolling";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function LocateMaintenancePage() {
  const t = useTranslations("common.maintenancePage");
  const locale = useLocale();
  const router = useRouter();

  const { checkHealth, isChecking } = useBackendHealthPolling({
    enabled: false,
    onHealthy: () => {
      router.replace(`/${locale}`);
    },
  });

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-zinc-950 overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-zinc-700" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-zinc-700" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-zinc-700" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-zinc-700" />

      <div className="relative z-10 flex flex-col items-center text-center gap-10">
        <div className="relative flex flex-col items-center">
          <p
            className="text-[180px] sm:text-[220px] font-black leading-none select-none tracking-tight text-transparent"
            style={{
              WebkitTextStroke: "2px rgba(220,38,38,0.35)",
              letterSpacing: "-0.04em",
            }}
          >
            {t("brandName")}
          </p>

          <p
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[80px] sm:text-[100px] font-black leading-none text-red-500 tracking-tight"
            style={{ letterSpacing: "-0.04em" }}
          >
            {t("comingSoon")}
          </p>

          <div className="relative mt-20 w-[320px] sm:w-[400px]">
            <Image
              src="/cars/notFoundCar.webp"
              alt={t("imageAlt")}
              width={400}
              height={280}
              className="w-full object-contain drop-shadow-2xl"
              priority
            />
            <div className="mx-auto mt-1 w-3/4 h-3 bg-red-600/15 blur-xl rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-3 max-w-sm">
          <p className="text-white text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {t("title")}
          </p>
          <p className="text-zinc-400 text-base leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-3 w-48">
          <div className="flex-1 h-px bg-zinc-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <Button
          variant="default"
          size="lg"
          disabled={isChecking}
          onClick={() => {
            void checkHealth();
          }}
        >
          {isChecking ? t("checking") : t("retry")}
        </Button>
      </div>
    </section>
  );
}
