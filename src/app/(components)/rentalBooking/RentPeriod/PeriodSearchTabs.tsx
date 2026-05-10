"use client";

import { Tabs, TabsList, TabsTrigger } from "@/ui";
import { RentPeriod } from "@/lib/stores/useUserPreferedFiltersStore";
import React from "react";
import { Calendar } from "@/app/(components)/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/(components)/ui/popover";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Separator } from "../../ui/separator";
import { Calendar1 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

interface PeriodSearchProps {
  value: RentPeriod;
  onValueChange: (value: RentPeriod) => void;
}

type RecommendationOption = {
  id: string;
  labelKey: string;
  amount: number;
};

type SelectableRentPeriod = Exclude<RentPeriod, "">;

const RECOMMENDATIONS: Record<SelectableRentPeriod, RecommendationOption[]> = {
  daily: [
    { id: "2d", labelKey: "recommendations.daily.2d", amount: 2 },
    { id: "3d", labelKey: "recommendations.daily.3d", amount: 3 },
    { id: "5d", labelKey: "recommendations.daily.5d", amount: 5 },
  ],
  weekly: [
    { id: "1w", labelKey: "recommendations.weekly.1w", amount: 1 },
    { id: "2w", labelKey: "recommendations.weekly.2w", amount: 2 },
    { id: "3w", labelKey: "recommendations.weekly.3w", amount: 3 },
  ],
  monthly: [
    { id: "1m", labelKey: "recommendations.monthly.1m", amount: 1 },
    { id: "2m", labelKey: "recommendations.monthly.2m", amount: 2 },
    { id: "3m", labelKey: "recommendations.monthly.3m", amount: 3 },
  ],
  yearly: [
    { id: "1y", labelKey: "recommendations.yearly.1y", amount: 1 },
    { id: "2y", labelKey: "recommendations.yearly.2y", amount: 2 },
    { id: "3y", labelKey: "recommendations.yearly.3y", amount: 3 },
  ],
};

const getEndDate = (
  period: RentPeriod,
  startDate: Date,
  amount: number,
): Date => {
  const endDate = new Date(startDate);
  const normalizedAmount = Math.max(amount - 1, 0);

  if (period === "daily") {
    endDate.setDate(endDate.getDate() + normalizedAmount);
    return endDate;
  }

  if (period === "weekly") {
    endDate.setDate(endDate.getDate() + amount * 7 - 1);
    return endDate;
  }

  if (period === "monthly") {
    endDate.setMonth(endDate.getMonth() + amount);
    endDate.setDate(endDate.getDate() - 1);
    return endDate;
  }

  endDate.setFullYear(endDate.getFullYear() + amount);
  endDate.setDate(endDate.getDate() - 1);
  return endDate;
};

const getActivePeriod = (period: RentPeriod): SelectableRentPeriod =>
  period === "" ? "daily" : period;

const toStartOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDate = (date: Date, locale: string): string =>
  date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const PeriodSearchTabs: React.FC<PeriodSearchProps> = ({
  value,
  onValueChange,
}) => {
  const router = useRouter();
  const appLocale = useLocale();
  const { setFilter, applyFilters } = useUserPreferedFiltersStore();
  const t = useTranslations("home.rentPeriodCard");
  const activePeriod = getActivePeriod(value);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date>(
    toStartOfDay(new Date()),
  );
  const [selectedRecommendation, setSelectedRecommendation] =
    React.useState<string>(RECOMMENDATIONS[activePeriod][0].id);
  const dateLocale = React.useMemo(() => t("dateLocale"), [t]);

  const periods: { value: RentPeriod; label: string }[] = [
    { value: "daily", label: t("tabs.daily") },
    { value: "weekly", label: t("tabs.weekly") },
    { value: "monthly", label: t("tabs.monthly") },
    { value: "yearly", label: t("tabs.yearly") },
  ];

  React.useEffect(() => {
    setSelectedRecommendation(RECOMMENDATIONS[activePeriod][0].id);
  }, [activePeriod]);

  const currentRecommendations = RECOMMENDATIONS[activePeriod];
  const selectedOption =
    currentRecommendations.find((item) => item.id === selectedRecommendation) ??
    currentRecommendations[0];

  const selectedRange = React.useMemo<DateRange>(() => {
    const from = toStartOfDay(startDate);
    const to = getEndDate(activePeriod, from, selectedOption.amount);
    return { from, to };
  }, [activePeriod, selectedOption.amount, startDate]);
  const calendarKey = `${activePeriod}-${selectedRecommendation}-${selectedRange.from?.toISOString()}-${selectedRange.to?.toISOString()}`;

  const handleShowResults = () => {
    if (!selectedRange.from || !selectedRange.to) return;
    onValueChange(activePeriod);
    setFilter("fromDate", selectedRange.from.toISOString());
    setFilter("toDate", selectedRange.to.toISOString());
    applyFilters();
    setIsCalendarOpen(false);
    router.push(`/${appLocale}/bookings`);
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <div>
          <Tabs
            value={value}
            onValueChange={(newValue) => {
              onValueChange(newValue as RentPeriod);
              setIsCalendarOpen(true);
            }}
            className="w-full"
          >
            <TabsList className="bg-transparent grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 h-fit w-full">
              {periods.map((period) => (
                <TabsTrigger
                  key={period.value}
                  value={period.value}
                  className="login-tab-trigger h-auto py-2 md:py-3 px-2 bg-[#F2F2F2]"
                >
                  <span className="login-tab-text text-xs sm:text-sm md:text-base">
                    {period.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </PopoverTrigger>

      <PopoverContent align="center" className="w-full p-2 rounded-2xl!">
        <Calendar
          key={calendarKey}
          mode="range"
          numberOfMonths={1}
          selected={selectedRange}
          defaultMonth={selectedRange.from}
          onDayClick={(day) => setStartDate(toStartOfDay(day))}
        />

        {selectedRange.from && selectedRange.to && (
          <p className="text-xs text-Grey700 text-center my-2 font-bold flex items-center justify-center gap-2">
            <Calendar1 className="w-4 h-4" />
            <span>{t("dateRange.from")}</span>
            <span className="underline">
              {formatDate(selectedRange.from, dateLocale)}
            </span>
            <span className="mx-2">{t("dateRange.to")}</span>
            <span className="underline">
              {formatDate(selectedRange.to, dateLocale)}
            </span>
          </p>
        )}
        <Separator />
        <div className="grid grid-cols-3 gap-2 mb-3 mt-3">
          {currentRecommendations.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => setSelectedRecommendation(option.id)}
              className={cn(
                "rounded-md border text-xs sm:text-sm py-1.5 px-2 transition-colors",
                selectedRecommendation === option.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-Grey700 border-Grey300 hover:border-primary",
              )}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleShowResults}
          className="w-full rounded-md py-2 bg-black text-white hover:opacity-90 transition-opacity"
        >
          {t("showResults")}
        </button>
      </PopoverContent>
    </Popover>
  );
};
