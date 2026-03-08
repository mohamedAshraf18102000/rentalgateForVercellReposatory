'use client';

import { Button } from '@/app/(components)/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/(components)/ui/popover';
import { useFilterStore } from '@/lib/api/stores/filter.store';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/ui';
import { ar } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

type DurationType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface FilterCarsProps {
  locale: string;
}

const durationLabels: Record<DurationType, { ar: string; en: string }> = {
  daily: { ar: 'يومي', en: 'Daily' },
  weekly: { ar: 'أسبوعي', en: 'Weekly' },
  monthly: { ar: 'شهري', en: 'Monthly' },
  yearly: { ar: 'سنوي', en: 'Yearly' },
};

export default function FilterCars({ locale }: FilterCarsProps) {
  const { fromDate, toDate, duration, setFromDate, setToDate, setDuration } = useFilterStore();
  const isArabic = locale === 'ar';

  const formatDate = (date: Date | null): string => {
    if (!date) return isArabic ? 'اختر التاريخ' : 'Select Date';
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const rangeFrom = fromDate || undefined;
  const rangeTo = toDate || undefined;
  const rangeValue =
    rangeFrom && rangeTo
      ? { from: rangeFrom, to: rangeTo }
      : rangeFrom
        ? { from: rangeFrom }
        : undefined;

  return (
    <div className="bg-white rounded-[20px] shadow-[0px_2px_8px_0px_#5858581A] p-4 md:p-6 w-full max-w-[450px] z-10">
      <div className="space-y-4">
        <div>
          <span className="text-sm font-medium text-gray-700 block mb-2">
            {isArabic ? 'مدة الإيجار' : 'Rental duration'}
          </span>
          <Tabs
            value={duration}
            onValueChange={(v) => setDuration(v as DurationType)}
            className="w-full"
          >
            <TabsList className="bg-[#ECEEF2] p-1 w-full grid grid-cols-4">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((d) => (
                <TabsTrigger
                  key={d}
                  value={d}
                  className="text-xs md:text-sm"
                >
                  {isArabic ? durationLabels[d].ar : durationLabels[d].en}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700 block mb-2">
            {isArabic ? 'من - إلى' : 'From - To'}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  'flex items-center gap-2 bg-[#ECEEF2] h-[38px] rounded-lg px-3 py-1.5 w-full cursor-pointer'
                )}
              >
                <span className="text-xs md:text-sm font-medium text-gray-900 truncate">
                  {rangeFrom && rangeTo
                    ? `${formatDate(rangeFrom)} → ${formatDate(rangeTo)}`
                    : isArabic
                      ? 'اختر الفترة'
                      : 'Select date range'}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4">
                <DayPicker
                  mode="range"
                  selected={rangeValue}
                  defaultMonth={rangeFrom || rangeTo || new Date()}
                  onSelect={(range: { from?: Date; to?: Date } | undefined) => {
                    if (range?.from) {
                      setFromDate(range.from);
                      if (range?.to) {
                        setToDate(range.to);
                      } else {
                        const to = new Date(range.from);
                        to.setDate(to.getDate() + 1);
                        setToDate(to);
                      }
                    }
                  }}
                  locale={isArabic ? ar : undefined}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const d = new Date(date);
                    d.setHours(0, 0, 0, 0);
                    return d < today;
                  }}
                  components={{
                    Chevron: ({ orientation }) =>
                      orientation === 'left' ? (
                        <Button variant="outline" size="icon" type="button">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon" type="button">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      ),
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>

        </div>
      </div>
    </div>
  );
}
