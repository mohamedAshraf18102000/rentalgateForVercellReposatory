/**
 * Reservation Actions Component (Refactored)
 * Main component that displays action buttons based on reservation status
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/app/(components)/ui/button';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CancellationDialog } from './reservation-actions/cancellation';
import { MaintenanceDialog } from './reservation-actions/maintenance';
import { ComplaintDialog } from './reservation-actions/complaint';
import { ExtensionDialog } from './reservation-actions/extension';
import { MaintenanceIcon } from '@/constants/icons';

interface ReservationActionsProps {
    reservationStatus: number;
    reservationId: number;
    locale: string;
    currentEndDate?: string; // Current reservation end date for extension
}

export default function ReservationActions({
    reservationStatus,
    reservationId,
    locale,
    currentEndDate,
}: ReservationActionsProps) {
    const t = useTranslations('profile');
    const isArabic = locale === 'ar';

    // Dialog states
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
    const [showComplaintDialog, setShowComplaintDialog] = useState(false);
    const [showExtensionDialog, setShowExtensionDialog] = useState(false);

    // Handle extend reservation
    const handleExtendReservation = () => {
        setShowExtensionDialog(true);
    };

    // Status 0, 1, 2, 3, 7: Show Cancel Reservation button
    if ([0, 1, 2, 7].includes(reservationStatus)) {
        return (
            <>
                <div className="flex items-center justify-between gap-3">
                    <Button
                        onClick={() => setShowCancelDialog(true)}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white px-5"
                        size="lg"
                    >
                        {t('cancelReservation')}
                    </Button>
                </div>
                <CancellationDialog
                    reservationId={reservationId}
                    locale={locale}
                    open={showCancelDialog}
                    onOpenChange={setShowCancelDialog}
                />
            </>
        );
    }

    // Status 5: Show Send Complaint button only
    if (reservationStatus === 5) {
        return (
            <>
                <div className="flex items-center justify-between gap-3">
                    <div></div>
                    <Button
                        onClick={() => setShowComplaintDialog(true)}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white"
                        size="lg"
                    >
                        {t('sendComplaint')}
                    </Button>
                </div>
                <ComplaintDialog
                    reservationId={reservationId}
                    locale={locale}
                    open={showComplaintDialog}
                    onOpenChange={setShowComplaintDialog}
                />
            </>
        );
    }

    // Status 4: Show Extend, Send Complaint, and Request Maintenance buttons
    if (reservationStatus === 4) {
        return (
            <>
                <div className="grid grid-cols-3 sm:flex sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    {/* Request Maintenance - Orange button on mobile, link on desktop */}
                    <Button
                        onClick={() => setShowMaintenanceDialog(true)}
                        variant="outline" size="lg" className='text-xs font-medium text-gray-900 rounded-[10px]'
                        icon={<MaintenanceIcon width={0} height={0} className="hidden sm:block sm:w-5 sm:h-5 shrink-0" />}
                    >
                        {t('requestMaintenance')}
                    </Button>

                    {/* Send Complaint - Orange button on mobile, outline on desktop */}
                    <Button
                        onClick={() => setShowComplaintDialog(true)}
                        variant="outline" size="lg" className='text-xs font-medium text-gray-900 rounded-[10px]'
                    >
                        {t('sendComplaint')}
                    </Button>

                    {/* Extend Reservation - Orange button on both */}
                    <Button
                        onClick={handleExtendReservation}
                        className="bg-primary hover:bg-primary-hover text-white border-primary px-2 sm:px-5 text-xs"
                        size="lg"
                    >
                        {t('extendReservation')}
                    </Button>
                </div>

                <MaintenanceDialog
                    reservationId={reservationId}
                    locale={locale}
                    open={showMaintenanceDialog}
                    onOpenChange={setShowMaintenanceDialog}
                />
                <ComplaintDialog
                    reservationId={reservationId}
                    locale={locale}
                    open={showComplaintDialog}
                    onOpenChange={setShowComplaintDialog}
                />
                <ExtensionDialog
                    reservationId={reservationId}
                    currentEndDate={currentEndDate || new Date().toISOString()}
                    locale={locale}
                    open={showExtensionDialog}
                    onOpenChange={setShowExtensionDialog}
                />
            </>
        );
    }

    // Default: No actions
    return null;
}
