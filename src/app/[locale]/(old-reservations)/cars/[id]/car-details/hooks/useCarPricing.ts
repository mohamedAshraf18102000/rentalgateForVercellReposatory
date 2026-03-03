/**
 * Hook for calculating car pricing information
 * Handles offer calculations and price formatting
 */

import { useMemo } from 'react';
import { useCarDataStore } from '@/lib/api/stores';
import { formatPrice } from '../utils/formatters';

export const useCarPricing = () => {
  const { car } = useCarDataStore();

  const hasOffer = useMemo(() => {
    if (!car) return false;
    return car.offer && car.offerDailyPrice > 0 && car.offerDailyPrice < car.dailyPrice;
  }, [car]);

  const currentPrice = useMemo(() => {
    if (!car) return 0;
    return hasOffer ? car.offerDailyPrice : car.dailyPrice;
  }, [car, hasOffer]);

  const originalPrice = useMemo(() => {
    if (!car) return 0;
    return hasOffer ? car.dailyPrice : car.dailyPrice;
  }, [car, hasOffer]);

  const discountPercentage = useMemo(() => {
    if (!hasOffer || originalPrice === 0) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }, [hasOffer, originalPrice, currentPrice]);

  return {
    hasOffer,
    currentPrice,
    originalPrice,
    discountPercentage,
    formatPrice,
  };
};

