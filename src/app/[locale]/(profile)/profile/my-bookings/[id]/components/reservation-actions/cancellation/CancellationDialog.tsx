/**
 * Cancellation Dialog Component
 * UI for canceling a reservation (Controlled Component)
 */

'use client';

import React, { useEffect } from 'react';
import { Button } from '@/app/(components)/ui/button';
import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Textarea } from '@/app/(components)/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/(components)/ui/select';
import { useTranslations } from 'next-intl';
import { useCancellation } from './useCancellation';

interface CancellationDialogProps {
  reservationId: number;
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancellationDialog({
  reservationId,
  locale,
  open,
  onOpenChange,
}: CancellationDialogProps) {
  const t = useTranslations('profile');
  const isArabic = locale === 'ar';

  const {
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
  } = useCancellation(reservationId, locale, onOpenChange);

  // Fetch reasons when dialog opens
  useEffect(() => {
    if (open) {
      fetchReasons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      header={{
        mainTitle: t('cancelReservationTitle'),
        description: (
          <p className="text-sm text-gray-600 text-center">
            {t('cancelReservationDescription')}
          </p>
        ),
      }}
      content={
        <div className="space-y-4">
          {isLoadingReasons ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Cancellation Reason */}
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
                  {t('cancellationReason')}{' '}
                  <span className="text-primary font-normal">*</span>
                </label>

                <Select
                  value={selectedReason?.toString()}
                  onValueChange={(value) => setSelectedReason(Number(value))}
                >
                  <SelectTrigger size="md">
                    <SelectValue placeholder={t('selectReason')} />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem
                        key={reason.reason_id}
                        value={reason.reason_id.toString()}
                      >
                        {isArabic ? reason.arabicName : reason.englishName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
                  {t('additionalNotes')}
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')}
                  rows={4}
                  className="resize-none text-sm min-h-[100px]"
                />
              </div>
            </>
          )}
        </div>
      }
      footer={
        <div className="flex gap-2 w-full mt-4">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
            disabled={isSubmitting || isLoadingReasons}
            className="flex-1"
            size="lg"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={submit}
            disabled={isSubmitting || isLoadingReasons}
            className="flex-1 bg-primary hover:bg-primary-hover text-white"
            size="lg"
          >
            {isSubmitting ? t('cancelling') : t('confirmCancel')}
          </Button>
        </div>
      }
    />
  );
}
