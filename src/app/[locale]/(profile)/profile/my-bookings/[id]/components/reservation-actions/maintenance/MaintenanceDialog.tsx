/**
 * Maintenance Dialog Component
 * UI for requesting maintenance (Controlled Component)
 */

'use client';

import React from 'react';
import { Button } from '@/app/(components)/ui/button';
import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Textarea } from '@/app/(components)/ui/textarea';
import { useTranslations } from 'next-intl';
import { useMaintenance } from './useMaintenance';

interface MaintenanceDialogProps {
  reservationId: number;
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaintenanceDialog({
  reservationId,
  locale,
  open,
  onOpenChange,
}: MaintenanceDialogProps) {
  const t = useTranslations('profile');

  const {
    comments,
    setComments,
    notes,
    setNotes,
    isSubmitting,
    submit,
    reset,
  } = useMaintenance(reservationId, locale, onOpenChange);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      header={{
        mainTitle: t('requestMaintenanceTitle'),
        description: (
          <p className="text-sm text-gray-600 text-center">
            {t('requestMaintenanceDescription')}
          </p>
        ),
      }}
      content={
        <div className="space-y-4">
          {/* Maintenance Comments */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
              {t('maintenanceComments')}{' '}
              <span className="text-primary font-normal">*</span>
            </label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={t('maintenanceCommentsPlaceholder')}
              rows={4}
              className="resize-none text-sm min-h-[100px]"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
              {t('maintenanceNotes')}
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('maintenanceNotesPlaceholder')}
              rows={3}
              className="resize-none text-sm min-h-[80px]"
            />
          </div>
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
            disabled={isSubmitting}
            className="flex-1"
            size="lg"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={submit}
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
            size="lg"
          >
            {isSubmitting ? t('submitting') : t('submitRequest')}
          </Button>
        </div>
      }
    />
  );
}
