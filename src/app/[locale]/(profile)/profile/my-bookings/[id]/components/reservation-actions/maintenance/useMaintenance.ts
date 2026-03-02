/**
 * Maintenance Hook
 * Handles maintenance request logic and state
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { submitMaintenanceRequest } from '@/lib/api/services/reservation-actions.service';

export function useMaintenance(
  reservationId: number,
  locale: string,
  onOpenChange?: (open: boolean) => void
) {
  const router = useRouter();
  const t = useTranslations('profile');
  const tValidation = useTranslations('validation.AUTH_ERRORS');

  const [comments, setComments] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form
  const reset = () => {
    setComments('');
    setNotes('');
  };

  // Submit maintenance request
  const submit = async () => {
    if (!comments.trim()) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    setIsSubmitting(true);
    try {
      await submitMaintenanceRequest({
        reservationId,
        reqComments: comments,
        notes,
      });

      toast.success(t('maintenanceSuccess'));
      reset();
      if (onOpenChange) onOpenChange(false);

      setTimeout(() => {
        router.push(`/${locale}/profile/my-bookings`);
      }, 500);
    } catch (error) {
      // Check if error message is RESERVATION_ALREADY_HAS_A_REQUEST
      const errorMessage =
        error instanceof Error ? error.message : t('maintenanceError');
      const translatedMessage =
        errorMessage === 'RESERVATION_ALREADY_HAS_A_REQUEST'
          ? tValidation('RESERVATION_ALREADY_HAS_A_REQUEST')
          : errorMessage;

      toast.error(translatedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    comments,
    setComments,
    notes,
    setNotes,
    isSubmitting,
    submit,
    reset,
  };
}

