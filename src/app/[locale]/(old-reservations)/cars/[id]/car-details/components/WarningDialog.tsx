/**
 * WarningDialog Component
 * Displays warning dialog for extra hours or extra day charges
 */

import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Button } from '@/app/(components)/ui/button';
import type { WarningInfo } from '../types';

type WarningDialogProps = {
  warningInfo: WarningInfo;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onReject: () => void;
  t: ReturnType<typeof import('next-intl').useTranslations<'carDetails'>>;
};

export const WarningDialog = ({
  warningInfo,
  isOpen,
  onOpenChange,
  onAccept,
  onReject,
  t,
}: WarningDialogProps) => {
  if (!warningInfo) return null;

  return (
    <DialogWrapper
      open={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      closeOnOutsideClick={false}
      header={{
        mainTitle: warningInfo.title,
      }}
      content={
        <div className="py-4">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              {warningInfo.message}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={onReject}
            variant="outline"
            className="px-6 h-10"
          >
            {t('disagree')}
          </Button>
          <Button
            onClick={onAccept}
            variant="default"
            className="px-6 h-10"
          >
            {t('agree')}
          </Button>
        </div>
      }
    />
  );
};

