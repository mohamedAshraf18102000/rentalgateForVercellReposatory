/**
 * Hook for managing extension pricing data and warnings
 * Handles fetching pricing from API and determining warnings for extensions
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { getExtensionPricing } from '@/lib/api/reservation-extension';
import { showApiMessage } from '@/lib/api/utils/toast-handler';
import type { ExtensionPricingData } from '@/lib/api/reservation-extension';
import type { ReservationDetails } from '@/lib/api/reservation-details';

export type WarningInfo = {
  title: string;
  message: string;
  type: 'extra_hours' | 'extra_day';
} | null;

interface UseExtensionPricingParams {
  reservation: ReservationDetails | null;
  extensionEndDate: string | null;
  extensionTime: string;
  reservationId: number;
  isInsuranceSelected: boolean;
  selectedPoints: number;
  promoCode: string | null;
  locale: string;
  lastEndTime?: string | null; // Last end time from reservation totals
  lastEndDate?: string | null; // Last end date from reservation totals
}

export const useExtensionPricing = ({
  reservation,
  extensionEndDate,
  extensionTime,
  reservationId,
  isInsuranceSelected,
  selectedPoints,
  promoCode,
  locale,
  lastEndTime,
  lastEndDate,
}: UseExtensionPricingParams) => {
  const t = useTranslations('carDetails');
  const tValidation = useTranslations('validation.AUTH_ERRORS');

  const [pricingData, setPricingData] = useState<ExtensionPricingData | null>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  // Use refs to track last payload and prevent duplicate requests
  const lastPayloadRef = useRef<string | null>(null);
  const isRequestInProgressRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format date and time to ISO string
  // date should be in YYYY-MM-DD format, time should be in HH:mm format (24-hour)
  const formatDateTime = (dateString: string | null, time: string): string | null => {
    if (!dateString || !time) return null;
    try {
      // Parse date string (YYYY-MM-DD) and time string (HH:mm)
      const [year, month, day] = dateString.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      
      // Create date in local timezone to avoid timezone conversion issues
      // Use the exact date and time values without timezone conversion
      const dateTime = new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
      
      // Format to ISO string using local date/time values to preserve the selected date
      const isoYear = dateTime.getFullYear();
      const isoMonth = String(dateTime.getMonth() + 1).padStart(2, '0');
      const isoDay = String(dateTime.getDate()).padStart(2, '0');
      const isoHours = String(dateTime.getHours()).padStart(2, '0');
      const isoMinutes = String(dateTime.getMinutes()).padStart(2, '0');
      const isoSeconds = String(dateTime.getSeconds()).padStart(2, '0');
      const isoMilliseconds = String(dateTime.getMilliseconds()).padStart(3, '0');
      
      // Return ISO format without timezone conversion to preserve the selected date
      return `${isoYear}-${isoMonth}-${isoDay}T${isoHours}:${isoMinutes}:${isoSeconds}.${isoMilliseconds}`;
    } catch {
      return null;
    }
  };

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
        if (!reservation || !extensionEndDate) {
          return;
        }

        // extensionEndDate is already in YYYY-MM-DD format, extensionTime is in HH:mm format (24-hour)
        const formattedEndDate = formatDateTime(
          extensionEndDate,
          extensionTime
        );

        if (!formattedEndDate) {
          return;
        }

        // Create payload key to compare with last request
        const payloadKey = JSON.stringify({
          reservationId,
          reservationEndDate: formattedEndDate,
          insurance: isInsuranceSelected ? 1 : 0,
          points: selectedPoints > 0 ? selectedPoints : undefined,
          promoCode: promoCode || undefined,
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
          const response = await getExtensionPricing({
            reservationId,
            reservationEndDate: formattedEndDate,
            insurance: isInsuranceSelected ? 1 : 0,
            points: selectedPoints > 0 ? selectedPoints : undefined,
            promoCode: promoCode || undefined,
            os: 1,
          });

          if (response?.data) {
            setPricingData(response.data);
            // Show success message when pricing is calculated
            if (response.message === 'SUCCESS') {
              showApiMessage('PRICING_CALCULATED_SUCCESS', tValidation);
            }

            // التحقق من الساعات الإضافية بعد validation فقط إذا كان extensionTime > originalEndTime (نفس اليوم)
            // Convert times to numbers for comparison (HH:MM format)
            const parseTimeToMinutes = (timeStr: string): number => {
              if (!timeStr) return 0;
              const [hours, minutes] = timeStr.split(':').map(Number);
              return (hours || 0) * 60 + (minutes || 0);
            };

            // Use lastEndTime from reservation totals if available, otherwise extract from endDate
            let originalEndTime = '';
            if (lastEndTime) {
              // lastEndTime is in format "HH:mm:ss" or "HH:mm"
              const timeParts = lastEndTime.split(':');
              originalEndTime = `${timeParts[0] || '00'}:${timeParts[1] || '00'}`;
            } else {
              // Fallback: Extract time from endDate (ISO format: "2026-01-23T22:30:00" or "2026-01-23")
            const originalEndDateObj = new Date(reservation.endDate);
              if (reservation.endDate.includes('T')) {
                const timePart = reservation.endDate.split('T')[1];
                if (timePart) {
                  const [hours, minutes] = timePart.split(':');
                  originalEndTime = `${hours || '00'}:${minutes || '00'}`;
                }
              } else {
                // If no time in endDate, extract from Date object
                originalEndTime = originalEndDateObj.getHours().toString().padStart(2, '0') + ':' + 
                                   originalEndDateObj.getMinutes().toString().padStart(2, '0');
              }
            }
            
            const originalEndTimeMinutes = parseTimeToMinutes(originalEndTime);
            const extensionTimeMinutes = parseTimeToMinutes(extensionTime);

            // Check if same day extension - use lastEndDate if available, otherwise use reservation.endDate
            const baseEndDate = lastEndDate || reservation.endDate;
            const originalEndDate = new Date(baseEndDate);
            originalEndDate.setHours(0, 0, 0, 0);
            const extensionDate = new Date(extensionEndDate);
            extensionDate.setHours(0, 0, 0, 0);
            const isSameDay = originalEndDate.getTime() === extensionDate.getTime();

            // Only show warning if extension time > original end time (same day extension)
            if (isSameDay && extensionTimeMinutes > originalEndTimeMinutes) {
              // التحقق من وجود priceDetails والقيم المطلوبة
              const resultPriceDetails = response.data;
              if (resultPriceDetails) {
                const totalPromoValue = resultPriceDetails.totalPromoValue || 0;
                const unfreeHours = (resultPriceDetails as any).unfreeHours || 0;
                const extraNewDayHours = resultPriceDetails.extraNewDayHours || 0;

                // عرض الـ modal فقط إذا كانت القيم أكبر من صفر
                if (totalPromoValue > 0 || unfreeHours > 0 || extraNewDayHours > 0) {
                  setIsWarningDialogOpen(true);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching extension pricing:', error);

          // Extract API message from error
          let apiMessage = '';
          if (error instanceof Error) {
            apiMessage = (error as any).apiMessage || error.message;
          }

          // Show error message in toast
          if (apiMessage) {
            showApiMessage(apiMessage, tValidation);
          } else {
            showApiMessage('CAR_AVAILABILITY_CHECK_FAILED', tValidation);
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
  }, [
    reservation,
    extensionEndDate,
    extensionTime,
    reservationId,
    isInsuranceSelected,
    selectedPoints,
    promoCode,
    lastEndTime,
    lastEndDate,
    tValidation,
  ]);

  // Determine warning type and message
  const warningInfo: WarningInfo = useMemo(() => {
    const priceDetails = pricingData;
    if (!priceDetails || !reservation) return null;

    // Convert times to numbers for comparison (HH:MM format)
    const parseTimeToMinutes = (timeStr: string): number => {
      if (!timeStr) return 0;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours || 0) * 60 + (minutes || 0);
    };

    // Use lastEndTime from reservation totals if available, otherwise extract from endDate
    let originalEndTime = '';
    if (lastEndTime) {
      // lastEndTime is in format "HH:mm:ss" or "HH:mm"
      const timeParts = lastEndTime.split(':');
      originalEndTime = `${timeParts[0] || '00'}:${timeParts[1] || '00'}`;
    } else {
      // Fallback: Extract time from endDate (ISO format: "2026-01-23T22:30:00")
    const originalEndDateObj = new Date(reservation.endDate);
      if (reservation.endDate.includes('T')) {
        const timePart = reservation.endDate.split('T')[1];
        if (timePart) {
          const [hours, minutes] = timePart.split(':');
          originalEndTime = `${hours || '00'}:${minutes || '00'}`;
        }
      } else {
        originalEndTime = originalEndDateObj.getHours().toString().padStart(2, '0') + ':' + 
                           originalEndDateObj.getMinutes().toString().padStart(2, '0');
      }
    }
    
    const originalEndTimeMinutes = parseTimeToMinutes(originalEndTime);
    const extensionTimeMinutes = parseTimeToMinutes(extensionTime);

    // Check if same day extension - use lastEndDate if available, otherwise use reservation.endDate
    const baseEndDate = lastEndDate || reservation.endDate;
    const originalEndDate = new Date(baseEndDate);
    originalEndDate.setHours(0, 0, 0, 0);
    const extensionDate = extensionEndDate ? new Date(extensionEndDate) : null;
    if (!extensionDate) return null;
    extensionDate.setHours(0, 0, 0, 0);
    const isSameDay = originalEndDate.getTime() === extensionDate.getTime();

    // Only show warning if extension time > original end time (same day extension)
    if (isSameDay && extensionTimeMinutes <= originalEndTimeMinutes) {
      return null;
    }

    const { extraNewDayHours, extraHoursCostWithVat, originalDailyPrice, totalPromoValue } = priceDetails;
    const unfreeHours = (priceDetails as any).unfreeHours || 0;

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
          cost: extraHoursCostWithVat?.toFixed(2) || 0,
        }),
        type: 'extra_hours',
      };
    } else if (extraNewDayHours > 0) {
      return {
        title: t('extra_day_warning_title'),
        message: t('extra_day_warning_message', {
          hours: extraNewDayHours,
          dailyPrice: originalDailyPrice?.toFixed(2) || 0,
        }),
        type: 'extra_day',
      };
    }
    return null;
  }, [pricingData, reservation, extensionTime, extensionEndDate, lastEndTime, lastEndDate, t]);

  // Handle warning dialog actions
  const handleWarningAccept = () => {
    setIsWarningDialogOpen(false);
  };

  const handleWarningReject = () => {
    setIsWarningDialogOpen(false);
  };

  return {
    pricingData,
    isLoadingPricing,
    setPricingData,
    warningInfo,
    isWarningDialogOpen,
    setIsWarningDialogOpen,
    handleWarningAccept,
    handleWarningReject,
  };
};
