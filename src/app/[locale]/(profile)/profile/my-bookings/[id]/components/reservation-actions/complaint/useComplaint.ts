/**
 * Complaint Hook
 * Handles complaint/CRM ticket logic and state
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  getTicketReasons,
  submitCRMTicket,
  type TicketReason,
} from '@/lib/api/services/reservation-actions.service';
import { uploadImage } from '@/lib/api/services/client.service';

export function useComplaint(
  reservationId: number,
  locale: string,
  onOpenChange?: (open: boolean) => void
) {
  const router = useRouter();
  const t = useTranslations('profile');

  const [reasons, setReasons] = useState<TicketReason[]>([]);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [details, setDetails] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reasons
  const fetchReasons = async () => {
    if (reasons.length > 0) return;

    setIsLoadingReasons(true);
    try {
      const data = await getTicketReasons();
      setReasons(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('complaintError')
      );
      if (onOpenChange) onOpenChange(false);
    } finally {
      setIsLoadingReasons(false);
    }
  };

  // Reset form
  const reset = () => {
    setTitle('');
    setSelectedReason(null);
    setDetails('');
    setAttachments([]);
  };

  // Submit complaint
  const submit = async () => {
    if (!title.trim() || !selectedReason || !details.trim()) {
      toast.error(t('pleaseFillAllFields'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload attachments first
      const attachmentsList: string[] = [];
      if (attachments.length > 0) {
        for (const file of attachments) {
          try {
            const filename = await uploadImage(file);
            attachmentsList.push(filename);
          } catch (error) {
            console.error('Error uploading attachment:', error);
            toast.error(
              error instanceof Error ? error.message : t('attachmentUploadError') || 'فشل في رفع المرفق'
            );
            setIsSubmitting(false);
            return;
          }
        }
      }

      const response = await submitCRMTicket({
        title,
        reservationId,
        reasonId: selectedReason,
        attachments: attachmentsList,
        details,
        ticketSource: 4, // Web Site
      });

      if (response.message === 'SUCCESS') {
        toast.success(t('complaintSuccess'));
        reset();
        if (onOpenChange) onOpenChange(false);

        setTimeout(() => {
          router.push(`/${locale}/profile/my-bookings`);
        }, 500);
      } else {
        throw new Error(response.message || t('complaintError'));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('complaintError')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reasons,
    isLoadingReasons,
    title,
    setTitle,
    selectedReason,
    setSelectedReason,
    details,
    setDetails,
    attachments,
    setAttachments,
    isSubmitting,
    fetchReasons,
    submit,
    reset,
  };
}

