/**
 * Hook for managing better price offers
 * Handles fetching and accepting/rejecting better price offers
 */

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useValidationStore, useCarDataStore, useFilterStore } from '@/lib/api/stores';
import { fetchBetterPrice, type BetterPriceData } from '@/constants/api';
import { formatDateTime } from '../utils/formatters';

export const useBetterPrice = () => {
  const router = useRouter();
  const { car } = useCarDataStore();
  const {
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
    setPickupDate,
    setDropoffDate,
    setPickupTime,
    setDropoffTime,
  } = useValidationStore();
  const { setFromDate, setToDate } = useFilterStore();

  const [betterPriceData, setBetterPriceData] = useState<BetterPriceData | null>(null);
  const [isBetterPriceDialogOpen, setIsBetterPriceDialogOpen] = useState(false);
  const [isCheckingBetterPrice, setIsCheckingBetterPrice] = useState(false);

  // Check for better price
  const checkBetterPrice = async () => {
    if (!car?.carId || !pickupDate || !dropoffDate) {
      return;
    }

    const startDateTime = formatDateTime(pickupDate, pickupTime);
    const endDateTime = formatDateTime(dropoffDate, dropoffTime);

    if (!startDateTime || !endDateTime) {
      return;
    }

    setIsCheckingBetterPrice(true);
    try {
      const response = await fetchBetterPrice({
        carId: car.carId,
        reservationStartDate: startDateTime,
        reservationEndDate: endDateTime,
      });

      if (response?.message === 'SUCCESS' && response.data) {
        setBetterPriceData(response.data);
        setIsCheckingBetterPrice(false);
        setIsBetterPriceDialogOpen(true);
      } else {
        // No better price available, go to booking page
        setTimeout(() => {
          router.push(`/booking`);
          setIsCheckingBetterPrice(false);
        }, 1000);
      }
    } catch (error) {
      // Error means no offer available, go to booking page
      setTimeout(() => {
        router.push(`/booking`);
        setIsCheckingBetterPrice(false);
      }, 1000);
    }
  };

  // Handle better price accept
  const handleAcceptBetterPrice = async () => {
    if (!betterPriceData) return;

    try {
      // Parse dates from better price data (format: "2025-12-25T15:30:00")
      const newStartDate = new Date(betterPriceData.from);
      const newEndDate = new Date(betterPriceData.to);

      // Extract time from dates
      const newStartTime = `${String(newStartDate.getHours()).padStart(2, '0')}:${String(newStartDate.getMinutes()).padStart(2, '0')}`;
      const newEndTime = `${String(newEndDate.getHours()).padStart(2, '0')}:${String(newEndDate.getMinutes()).padStart(2, '0')}`;

      // Create date-only versions for filter store (dates without time)
      const newStartDateOnly = new Date(newStartDate);
      newStartDateOnly.setHours(0, 0, 0, 0);
      const newEndDateOnly = new Date(newEndDate);
      newEndDateOnly.setHours(0, 0, 0, 0);

      // First update filter store (date-only, no time)
      // This will trigger sync in PickupTimeSection, but we'll override with full date-time below
      setFromDate(newStartDateOnly);
      setToDate(newEndDateOnly);

      // Then update validation store with full date-time (this takes precedence)
      // The full date-time includes the time component from betterPriceData
      setPickupDate(newStartDate);
      setDropoffDate(newEndDate);
      setPickupTime(newStartTime);
      setDropoffTime(newEndTime);

      // Close dialog
      setIsBetterPriceDialogOpen(false);
      setBetterPriceData(null);

      // The useEffect in usePricing will automatically fetch new pricing with updated dates
    } catch (error) {
      console.error('Error accepting better price:', error);
    }
  };

  // Handle better price reject
  const handleRejectBetterPrice = () => {
    setIsBetterPriceDialogOpen(false);
    setBetterPriceData(null);
    router.push(`/booking`);
  };

  return {
    betterPriceData,
    isBetterPriceDialogOpen,
    isCheckingBetterPrice,
    checkBetterPrice,
    handleAcceptBetterPrice,
    handleRejectBetterPrice,
    setIsBetterPriceDialogOpen,
  };
};

