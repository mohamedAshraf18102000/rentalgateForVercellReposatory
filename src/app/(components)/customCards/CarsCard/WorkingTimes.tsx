import { useState } from "react";
import { DialogWrapper } from "@/app/(components)/ui/dialog-wrapper";
import { WorkingHours } from "@/types/companyCars/carDetails";
import { Clock, Coffee, ChevronLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const DAYS = [
  { key: "sun", dayOfWeek: "SUNDAY" },
  { key: "mon", dayOfWeek: "MONDAY" },
  { key: "tue", dayOfWeek: "TUESDAY" },
  { key: "wed", dayOfWeek: "WEDNESDAY" },
  { key: "thu", dayOfWeek: "THURSDAY" },
  { key: "fri", dayOfWeek: "FRIDAY" },
  { key: "sat", dayOfWeek: "SATURDAY" },
] as const;

const formatTime = (time: string, locale: string) => {
  const [hourStr, minuteStr] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10), 0, 0);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const WorkingTimes = ({ workingHours }: { workingHours: WorkingHours }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("carDetails");
  const locale = useLocale();
  const todayIndex = new Date().getDay();

  const dialogContent = (
    <div className="flex flex-col gap-1">
      {DAYS.map(({ key, dayOfWeek }, index) => {
        const openTime = workingHours[
          `${key}OpenTime` as keyof WorkingHours
        ] as string;
        const closeTime = workingHours[
          `${key}CloseTime` as keyof WorkingHours
        ] as string;
        const isToday = index === todayIndex;
        const dayDate = new Date(2026, 0, 4 + index);
        const short = new Intl.DateTimeFormat(locale, {
          weekday: "short",
        })
          .format(dayDate)
          .toUpperCase();

        const dayBreaks = workingHours.breaks?.filter(
          (b) => b.dayOfWeek === dayOfWeek,
        );

        return (
          <div key={key}>
            <div
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                isToday
                  ? "bg-primary/8 ring-1 ring-primary/20"
                  : "hover:bg-muted/50"
              }`}
            >
              <div
                className={`w-10 text-center text-[10px] font-bold tracking-widest rounded-md py-1 shrink-0 ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {short}
              </div>

              <div className="flex items-center gap-2 flex-1">
                <span
                  className={`text-sm tabular-nums ${
                    isToday
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatTime(openTime, locale)}
                </span>
                <span className="text-muted-foreground/40 text-xs">-</span>
                <span
                  className={`text-sm tabular-nums ${
                    isToday
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatTime(closeTime, locale)}
                </span>
              </div>

              {isToday && (
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  {t("today")}
                </span>
              )}
            </div>

            {dayBreaks && dayBreaks.length > 0 && (
              <div className="mx-5 mb-1 flex flex-col gap-0.5">
                {dayBreaks.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60"
                  >
                    <Coffee className="w-3 h-3 shrink-0" />
                    <span>
                      {t("breakLabel")} {formatTime(b.startTime, locale)} -{" "}
                      {formatTime(b.endTime, locale)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="lg"
      className="max-w-2xl rounded-2xl border-0 p-0 shadow-2xl"
      contentClassName="p-0"
      trigger={
        // ── Inline trigger — blends with the surrounding info rows ──
        <button
          type="button"
          className="
            group w-full flex items-center justify-between
            px-1 py-2
            text-right
            rounded-lg border border-transparent
            transition-colors duration-200
            hover:bg-muted/40 hover:border-muted-foreground/20
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
          "
        >
          {/* Left side: chevron (RTL end arrow) */}

          {/* Right side: icon + text (RTL layout) */}
          <div className="flex items-center gap-2">
            <div className="bg-Grey200 w-8 h-8 flex items-center justify-center rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {t("workingHours")}
              </span>
              <span className="text-xs text-muted-foreground">
                {locale === "ar"
                  ? workingHours.branchArName
                  : workingHours.branchEnName}
              </span>
            </div>
          </div>
          <ChevronLeft className="h-4 w-4 text-muted-foreground/50 shrink-0 transition-transform group-hover:-translate-x-0.5" />
        </button>
      }
      header={{ mainTitle: t("workingHours") }}
      content={
        <div className="max-h-[65vh] overflow-y-auto px-6 pb-5 pt-2">
          {dialogContent}
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end border-t border-zinc-100 pt-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-zinc-700 active:scale-[0.98]"
          >
            {t("closeDialog")}
          </button>
        </div>
      }
    />
  );
};

export default WorkingTimes;
