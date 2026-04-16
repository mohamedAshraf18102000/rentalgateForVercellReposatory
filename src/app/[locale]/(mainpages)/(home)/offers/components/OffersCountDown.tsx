"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";

const getRemainingMsUntilEndOfDay = () => {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return Math.max(0, endOfDay.getTime() - now.getTime());
};

const getTimeParts = (remainingMs: number) => {
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
  };
};

const OffersCountDown = () => {
  // `useLocale` is deterministic for SSR/CSR, avoiding hydration mismatches.
  const locale = useLocale().toLowerCase();
  const isArabic = locale.startsWith("ar");

  const content = useMemo(
    () => ({
      heading: isArabic
        ? "أفضل عروض التأجير اليومية متبقي"
        : "Best daily rental offers remaining",
      unit: isArabic ? "ساعة" : "hours",
    }),
    [isArabic],
  );

  // Important: initial state must be deterministic across SSR and hydration.
  // We start updating "real time" only after mount.
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextTick = () => {
      const delay = 1000 - (Date.now() % 1000);

      timeoutId = setTimeout(() => {
        setRemainingMs(getRemainingMsUntilEndOfDay());
        scheduleNextTick();
      }, delay);
    };

    setRemainingMs(getRemainingMsUntilEndOfDay());
    scheduleNextTick();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
    [locale],
  );

  const { hours, minutes, seconds } = useMemo(
    () => getTimeParts(remainingMs),
    [remainingMs],
  );

  const formattedHours = useMemo(
    () => formatter.format(hours),
    [formatter, hours],
  );
  const formattedMinutes = useMemo(
    () => formatter.format(minutes),
    [formatter, minutes],
  );
  const formattedSeconds = useMemo(
    () => formatter.format(seconds),
    [formatter, seconds],
  );

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-Green200 rounded-[8px] mt-3 w-full sm:w-auto max-w-full px-3 py-2 flex items-center justify-center gap-2 sm:gap-3"
    >
      <Image
        width={100}
        height={100}
        className="object-contain w-5 h-5 sm:w-6 sm:h-6 shrink-0"
        src="/shared/FestivalIcon.png"
        alt="offer"
      />
      <div className="font-bold text-sm sm:text-base flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
        <span>{content.heading}</span>
        <div className="flex items-center gap-1" dir="ltr">
          <span className="bg-white px-1.5 py-0.5 rounded-[5px] min-w-8 h-7 flex items-center justify-center">
            {formattedHours}
          </span>
          <span className="mx-1">:</span>
          <span className="bg-white px-1.5 py-0.5 rounded-[5px] min-w-8 h-7 flex items-center justify-center">
            {formattedMinutes}
          </span>
          <span className="mx-1">:</span>
          <span className="bg-white px-1.5 py-0.5 rounded-[5px] min-w-8 h-7 flex items-center justify-center">
            {formattedSeconds}
          </span>
        </div>
        <span className="ms-1">{content.unit}</span>
      </div>
      <Image
        width={100}
        height={100}
        className="object-contain w-5 h-5 sm:w-6 sm:h-6 shrink-0"
        src="/shared/FestivalIcon.png"
        alt="offer"
      />
    </div>
  );
};

export default OffersCountDown;
