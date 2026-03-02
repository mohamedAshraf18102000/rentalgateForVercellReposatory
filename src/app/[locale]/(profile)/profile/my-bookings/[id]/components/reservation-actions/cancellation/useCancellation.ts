/**
 * Cancellation Hook
 * Handles cancellation logic and state
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  getCancellationReasons,
  cancelReservation,
  type CancellationReason,
} from '@/lib/api/services/reservation-actions.service';

export function useCancellation(
  reservationId: number,
  locale: string,
  onOpenChange?: (open: boolean) => void
) {
  const router = useRouter();
  const t = useTranslations('profile');

  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reasons
  const fetchReasons = async () => {
    if (reasons.length > 0) return;

    setIsLoadingReasons(true);
    try {
      const data = await getCancellationReasons();
      setReasons(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('cancelError')
      );
      if (onOpenChange) onOpenChange(false);
    } finally {
      setIsLoadingReasons(false);
    }
  };

  // Reset form
  const reset = () => {
    setSelectedReason(null);
    setNotes('');
  };

  // Submit cancellation
  const submit = async () => {
    if (!selectedReason) {
      toast.error(t('pleaseSelectReason'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await cancelReservation(reservationId, {
        reasonId: selectedReason,
        notes,
      });

      if (response.message === 'SUCCESS') {
        toast.success(t('cancelSuccess'));
        reset();
        if (onOpenChange) onOpenChange(false);

        setTimeout(() => {
          router.push(`/${locale}/profile/my-bookings`);
        }, 500);
      } else {
        throw new Error(response.message || t('cancelError'));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('cancelError')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reasons,
    isLoadingReasons,
    selectedReason,
    setSelectedReason,
    notes,
    setNotes,
    isSubmitting,
    fetchReasons,
    submit,
    reset,
  };
}

