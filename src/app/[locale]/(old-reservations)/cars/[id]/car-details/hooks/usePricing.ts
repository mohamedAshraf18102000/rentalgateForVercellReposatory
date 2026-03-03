/**
 * Hook for managing pricing data and warnings
 * Handles fetching pricing from API and determining warnings
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useValidationStore, useCarDataStore } from '@/lib/api/stores';
import { getReservationPricing, getPricingFromCookie } from '@/lib/api/pricing';
import { showApiMessage } from '@/lib/api/utils/toast-handler';
import { formatDateTime } from '../utils/formatters';
import type { PricingData } from '../types';
import type { WarningInfo } from '../types';

export const usePricing = () => {
  const t = useTranslations('carDetails');
  const tValidation = useTranslations('validation.AUTH_ERRORS');

  const {
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
    fromBranch,
    toBranch,
  } = useValidationStore();

  const { car } = useCarDataStore();

  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  // Use refs to track last payload and prevent duplicate requests
  const lastPayloadRef = useRef<string | null>(null);
  const isRequestInProgressRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch pricing when all required data is available
  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Debounce the request to avoid multiple rapid calls
    timeoutRef.current = setTimeout(() => {
      const fetchPricing = async () => {
        // Check if all required data is available
        if (!car?.carId || !pickupDate || !dropoffDate || !fromBranch) {
          return;
        }

        // Use toBranch if available, otherwise use fromBranch
        const finalToBranch = toBranch || fromBranch;

        const startDateTime = formatDateTime(pickupDate, pickupTime);
        const endDateTime = formatDateTime(dropoffDate, dropoffTime);

        if (!startDateTime || !endDateTime) {
          return;
        }

        // Create payload key to compare with last request
        const payloadKey = JSON.stringify({
          carId: car.carId,
          reservationStartDate: startDateTime,
          reservationEndDate: endDateTime,
          fromBranch: fromBranch,
          toBranch: finalToBranch,
        });

        // Skip if this is the same payload as the last request
        if (lastPayloadRef.current === payloadKey) {
          return;
        }

        // Skip if there's already a request in progress
        if (isRequestInProgressRef.current) {
          return;
        }

        // Mark request as in progress and save payload
        isRequestInProgressRef.current = true;
        lastPayloadRef.current = payloadKey;

        setIsLoadingPricing(true);
        try {
          const response = await getReservationPricing({
            carId: car.carId,
            reservationStartDate: startDateTime,
            reservationEndDate: endDateTime,
            fromBranch: fromBranch,
            toBranch: finalToBranch,
          });

          if (response?.data) {
            setPricingData(response.data);
            // Show success message when pricing is calculated
            if (response.message === 'SUCCESS') {
              showApiMessage('PRICING_CALCULATED_SUCCESS', tValidation);
            }

            // التحقق من الساعات الإضافية بعد validation فقط إذا كان startTime < endTime
            // Convert times to numbers for comparison (HH:MM format)
            const parseTimeToMinutes = (timeStr: string): number => {
              if (!timeStr) return 0;
              const [hours, minutes] = timeStr.split(':').map(Number);
              return (hours || 0) * 60 + (minutes || 0);
            };

            const startTime = parseTimeToMinutes(pickupTime || '');
            const endTime = parseTimeToMinutes(dropoffTime || '');

            // Only show warning if startTime < endTime (same day booking)
            if (startTime < endTime) {
              // التحقق من وجود priceDetails والقيم المطلوبة
              const resultPriceDetails = response.data;
              if (resultPriceDetails) {
                const totalPromoValue = resultPriceDetails.totalPromoValue || 0;
                const unfreeHours = resultPriceDetails.unfreeHours || 0;
                const extraNewDayHours = resultPriceDetails.extraNewDayHours || 0;

                // عرض الـ modal فقط إذا كانت القيم أكبر من صفر
                if (totalPromoValue > 0 || unfreeHours > 0 || extraNewDayHours > 0) {
                  setIsWarningDialogOpen(true);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching pricing:', error);

          // Extract API message from error
          let apiMessage = '';
          if (error instanceof Error) {
            // Check if error has apiMessage property
            apiMessage = (error as any).apiMessage || error.message;
          }

          // Show error message in toast
          if (apiMessage) {
            showApiMessage(apiMessage, tValidation);
          } else {
            showApiMessage('CAR_AVAILABILITY_CHECK_FAILED', tValidation);
          }

          // Try to get from cookie as fallback
          const cachedPricing = getPricingFromCookie();
          if (cachedPricing) {
            setPricingData(cachedPricing);
          }

          // Reset last payload on error so we can retry
          lastPayloadRef.current = null;
        } finally {
          setIsLoadingPricing(false);
          isRequestInProgressRef.current = false;
        }
      };

      fetchPricing();
    }, 300); // 300ms debounce delay

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [car?.carId, pickupDate, dropoffDate, pickupTime, dropoffTime, fromBranch, toBranch, tValidation]);

  // Get saved pricing from cookie
  const savedPricing = getPricingFromCookie();

  // Determine warning type and message
  const warningInfo: WarningInfo = useMemo(() => {
    const priceDetails = pricingData;
    if (!priceDetails) return null;

    // Convert times to numbers for comparison (HH:MM format)
    const parseTimeToMinutes = (timeStr: string): number => {
      if (!timeStr) return 0;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours || 0) * 60 + (minutes || 0);
    };

    const startTime = parseTimeToMinutes(pickupTime || '');
    const endTime = parseTimeToMinutes(dropoffTime || '');

    // Only show warning if startTime < endTime (same day booking)
    if (startTime >= endTime) {
      return null;
    }

    const { unfreeHours, extraNewDayHours, extraHoursCostWithVat, originalDailyPrice, totalPromoValue } = priceDetails;

    // Check if there are any extra charges
    const hasExtraCharges = (totalPromoValue || 0) > 0 || (unfreeHours || 0) > 0 || (extraNewDayHours || 0) > 0;
    
    if (!hasExtraCharges) {
      return null;
    }

    if (unfreeHours > 0) {
      return {
        title: t('extra_hours_warning_title'),
        message: t('extra_hours_warning_message', {
          hours: unfreeHours,
          cost: extraHoursCostWithVat?.toFixed(2) || 0
        }),
        type: 'extra_hours'
      };
    } else if (extraNewDayHours > 0) {
      return {
        title: t('extra_day_warning_title'),
        message: t('extra_day_warning_message', {
          hours: extraNewDayHours,
          dailyPrice: originalDailyPrice?.toFixed(2) || 0
        }),
        type: 'extra_day'
      };
    }
    return null;
  }, [pricingData, pickupTime, dropoffTime, t]);

  // Handle warning dialog actions
  const handleWarningAccept = () => {
    setIsWarningDialogOpen(false);
  };

  const handleWarningReject = () => {
    setIsWarningDialogOpen(false);
  };

  return {
    warningInfo,
    isWarningDialogOpen,
    setIsWarningDialogOpen,
    handleWarningAccept,
    handleWarningReject,
    savedPricing,
    isLoadingPricing,
  };
};

