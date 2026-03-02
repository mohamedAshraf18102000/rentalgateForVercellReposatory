/**
 * First Booking Check Component
 * Main component that handles first booking validation and form submission
 * 
 * This component:
 * - Checks if user is making their first booking
 * - Shows a loading spinner for 3 seconds
 * - Displays a form dialog if data is incomplete
 * - Handles form submission to complete user data
 */

'use client';

import { DialogWrapper, Button } from '@/ui';
import { useTranslations } from 'next-intl';
import { useFirstBookingCheck } from './hooks/useFirstBookingCheck';
import { IdentityFields } from './components/IdentityFields';
import { FormFields } from './components/FormFields';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { FirstBookingCheckProps } from './util/types';
import { useRouter } from '@/i18n/routing';
import { ArrowIcon } from '@/constants/icons';

export function FirstBookingCheck({ locale }: FirstBookingCheckProps) {
    const t = useTranslations('carDetails');
    const router = useRouter();

    const {
        showDialog,
        isLoading,
        isSubmitting,
        isMobileDisabled,
        isEmailDisabled,
        clientType,
        control,
        handleSubmit,
        errors,
        watch,
        setValue,
        trigger,
        onSubmit,
        setShowDialog,
    } = useFirstBookingCheck(locale);

    if (!isLoading && !showDialog) {
        return null;
    }

    return (
        <>
            {isLoading && <LoadingSpinner locale={locale} />}

            <DialogWrapper
                open={showDialog}
                onOpenChange={(open) => {
                    if (!open && showDialog) {
                        setTimeout(() => setShowDialog(true), 0);
                    }
                }}
                size="md"
                closeOnOutsideClick={false}
                scrollableContent={true}
                maxScrollHeight="400px"
                header={{
                    mainTitle: t('first_booking_title'),
                }}
                content={
                    <form id="first-booking-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
                        <p className="text-base text-[#757575] mb-4 text-center">
                            {t('first_booking_message')}
                        </p>

                        <FormFields
                            locale={locale}
                            control={control}
                            errors={errors}
                            trigger={trigger}
                            clientType={clientType}
                            setValue={setValue}
                            watch={watch}
                            isMobileDisabled={isMobileDisabled}
                            isEmailDisabled={isEmailDisabled}
                        />

                        <IdentityFields
                            clientType={clientType}
                            locale={locale}
                            control={control}
                            errors={errors}
                            trigger={trigger}
                        />
                    </form>
                }
                footer={
                    <div className="grid grid-cols-12 gap-2  mt-4 w-full">
                        <div className="col-span-8">
                            <Button
                                type="submit"
                                form="first-booking-form"
                                className="px-6 py-4 w-full"
                                disabled={isSubmitting}
                                size="lg"
                            >
                                {isSubmitting ? t('submitting') : t('confirm')}
                            </Button>
                        </div>
                        <div className="col-span-4">
                            <Button
                                variant="outline"
                                size="lg"
                                className='text-sm font-medium text-gray-900 rounded-[10px] w-full'
                                icon={<ArrowIcon className={`w-4 h-4 ${locale === 'ar' ? '' : 'rotate-180'}`} />}
                                onClick={() => router.back()}
                            >
                                {t('back')}
                            </Button>
                        </div>
                    </div>
                }
            />
        </>
    );
}
