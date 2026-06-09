import { useMemo } from "react";
import {
  calculateRentalPrice,
  PricingType,
} from "@/lib/utils/calculateRentalPrice";
import { CalculateQuotePriceResponse } from "@/services/calculateQuotePrice/calculateQuotePrice.service";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

export interface ReservationPricingDetails {
  totalPrice: number;
  originalTotalPrice: number;
  pricePerDay: number;
  originalPricePerDay: number;
  pricingType: PricingType;
  days: number;
}

interface UseReservationPricingParams {
  rentalDays: number;
  calculatedQuotePricingData?: CalculateQuotePriceResponse;
}

export function useReservationPricing({
  rentalDays,
  calculatedQuotePricingData,
}: UseReservationPricingParams): ReservationPricingDetails {
  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);

  return useMemo(() => {
    const effectiveDays = rentalDays > 0 ? rentalDays : 1;

    const effectivePricing = calculateRentalPrice({
      days: effectiveDays,
      dailyPrice: carDetails?.dailyPrice ?? 0,
      weeklyPrice: carDetails?.weeklyPrice ?? 0,
      halfMonthlyPrice: carDetails?.halfMonthPrice ?? 0,
      monthlyPrice: carDetails?.monthlyPrice ?? 0,
      yearlyPrice: carDetails?.yearlyPrice ?? 0,
      offerDailyPrice: carDetails?.offerDailyPrice ?? 0,
      offerWeeklyPrice: carDetails?.offerWeeklyPrice ?? 0,
      offerHalfMonthlyPrice: carDetails?.offerHalfMonthPrice ?? 0,
      offerMonthlyPrice: carDetails?.offerMonthlyPrice ?? 0,
      offerYearlyPrice: carDetails?.offerYearlyPrice ?? 0,
    });

    const originalPricing = calculateRentalPrice({
      days: effectiveDays,
      dailyPrice: carDetails?.dailyPrice ?? 0,
      weeklyPrice: carDetails?.weeklyPrice ?? 0,
      halfMonthlyPrice: carDetails?.halfMonthPrice ?? 0,
      monthlyPrice: carDetails?.monthlyPrice ?? 0,
      yearlyPrice: carDetails?.yearlyPrice ?? 0,
      offerDailyPrice: 0,
      offerWeeklyPrice: 0,
      offerHalfMonthlyPrice: 0,
      offerMonthlyPrice: 0,
      offerYearlyPrice: 0,
    });

    if (calculatedQuotePricingData) {
      const apiDays =
        calculatedQuotePricingData.dataForReservation?.days || effectiveDays;
      const totalDiscounts =
        (calculatedQuotePricingData.promoDiscount || 0) +
        (calculatedQuotePricingData.businessDiscount || 0) +
        (calculatedQuotePricingData.carDaysDiscount || 0) +
        (calculatedQuotePricingData.pointsDiscount || 0);

      const apiTotal = calculatedQuotePricingData.total;

      return {
        totalPrice: apiTotal,
        originalTotalPrice: apiTotal + totalDiscounts,
        pricePerDay: apiTotal / apiDays,
        originalPricePerDay: (apiTotal + totalDiscounts) / apiDays,
        pricingType: calculatedQuotePricingData.appliedPlan,
        days: apiDays,
      };
    }

    return {
      totalPrice: effectivePricing.totalPrice,
      originalTotalPrice: originalPricing.totalPrice,
      pricePerDay: effectivePricing.pricePerDay,
      originalPricePerDay: originalPricing.pricePerDay,
      pricingType: effectivePricing.pricingType,
      days: effectiveDays,
    };
  }, [carDetails, rentalDays, calculatedQuotePricingData]);
}
