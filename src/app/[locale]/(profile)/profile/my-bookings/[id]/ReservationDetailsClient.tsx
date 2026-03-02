'use client';

/**
 * Reservation Details Client Component
 * Main component that orchestrates all reservation detail sections
 */

import { useStickyHeader } from '@/hooks/useStickyHeader';
import { getReservationServices, getReservationTotals, ReservationDetails, ReservationService, ReservationTotals } from '@/lib/api/reservation-details';
import { useEffect, useState } from 'react';
import CarImageSection from './components/CarImageSection';
import CarInfoSection from './components/CarInfoSection';
import ExtraKmsSection from './components/ExtraKmsSection';
import InvoiceDetailsSection from './components/InvoiceDetailsSection';
import PickupDropoffLocationSection from './components/PickupDropoffLocationSection';
import ReservationExtensionsSection from './components/ReservationExtensionsSection';
import ReservationForOtherSection from './components/ReservationForOtherSection';
import ReservationHeader from './components/ReservationHeader';
import ReservationServicesSection from './components/ReservationServicesSection';
import TimelineSection from './components/TimelineSection';
import { formatDateTime } from './utils/formatters';


interface ReservationDetailsClientProps {
    reservation: ReservationDetails;
    locale: string;
    token: string;
    reservationId: string;
}

export default function ReservationDetailsClient({ reservation, locale, token, reservationId }: ReservationDetailsClientProps) {
    const isArabic = locale === 'ar';
    const [services, setServices] = useState<ReservationService[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [totals, setTotals] = useState<ReservationTotals | null>(null);
    const [isLoadingTotals, setIsLoadingTotals] = useState(false);

    // Use sticky header hook
    const { showStickyHeader, containerRef, stickyTriggerRef, headerStyle } = useStickyHeader();

    // Fetch reservation services
    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingServices(true);
            try {
                const response = await getReservationServices(reservation.reservationId, token);
                if (response.message === 'SUCCESS' && response.data) {
                    setServices(response.data);
                }
            } catch (error) {
                console.error('Error fetching reservation services:', error);
            } finally {
                setIsLoadingServices(false);
            }
        };

        fetchServices();
    }, [reservation.reservationId, token]);

    // Fetch reservation totals
    useEffect(() => {
        const fetchTotals = async () => {
            setIsLoadingTotals(true);
            try {
                const response = await getReservationTotals(reservation.reservationId, token);
                if (response.message === 'SUCCESS' && response.data) {
                    setTotals(response.data);
                }
            } catch (error) {
                console.error('Error fetching reservation totals:', error);
            } finally {
                setIsLoadingTotals(false);
            }
        };

        fetchTotals();
    }, [reservation.reservationId, token]);

    // Format date and time
    const startDateTime = formatDateTime(reservation.startDate, isArabic);
    const endDateTime = formatDateTime(reservation.endDate, isArabic);

    // Get branch names
    const fromBranch = isArabic ? reservation.fromBranchArName : reservation.fromBranchName;
    const toBranch = isArabic ? reservation.toBranchArName : reservation.toBranchName;

    return (
        <div className='custom-bg'>
            <div className="container-custom py-4 md:py-8" dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                    {/* Car Image Section */}
                    <CarImageSection carImage={reservation.carImage} carName={reservation.carName} />

                    {/* Details Section */}
                    <div ref={containerRef} className="md:col-span-7 w-full md:sticky md:top-[100px] md:self-start md:z-10 order-2 md:order-2 xl:col-span-6 xl:col-start-2">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            {/* Header - hidden when sticky header is shown */}
                            {!showStickyHeader && (
                                <ReservationHeader
                                    reservationStatus={reservation.reservationStatus}
                                    reservationId={reservation.reservationId}
                                    locale={locale}
                                    currentEndDate={reservation.endDate}
                                    finalAmount={reservation.total}
                                />
                            )}

                            <div className="p-6 relative">
                                {/* Car Info */}
                                <CarInfoSection
                                    reservationId={reservationId ?? '0'}
                                    numberOfPassengers={reservation.numberOfPassengers ?? 0}
                                    carName={reservation.carName}
                                    days={reservation.days}
                                    total={reservation.total}
                                    totalDiscount={reservation.totalDiscount}
                                    carType={isArabic ? reservation.typeArabicName : reservation.typeEnglishName}
                                    locale={locale}
                                    modelArabicName={reservation.modelArabicName}
                                    modelEnglishName={reservation.modelEnglishName}
                                    brandArabicName={reservation.brandArabicName}
                                    brandName={reservation.brandName}
                                    year={reservation.year}
                                />

                                {/* Reservation For Other Person */}
                                {reservation.reservationForOther && (
                                    <ReservationForOtherSection
                                        reservationForOther={reservation.reservationForOther}
                                        locale={locale}
                                    />
                                )}

                                {/* Pickup and Dropoff Locations */}
                                <PickupDropoffLocationSection
                                    fromBranch={fromBranch}
                                    toBranch={toBranch}
                                    locale={locale}
                                />

                                {/* Timeline */}
                                <TimelineSection
                                    startDateTime={startDateTime}
                                    endDateTime={endDateTime}
                                    fromBranch={fromBranch}
                                    toBranch={toBranch}
                                    days={reservation.days}
                                    locale={locale}
                                />

                                {/* Extra Kms Package */}
                                {reservation.extraKmCost > 0 && reservation.extraKmPackage > 0 && (
                                    <ExtraKmsSection
                                        extraKmCost={reservation.extraKmCost * 1.15}
                                        extraKmPackage={reservation.extraKms}
                                        locale={locale}
                                    />
                                )}
                                {/* Selected Services */}
                                {!isLoadingServices && services.length > 0 && (
                                    <ReservationServicesSection
                                        services={services}
                                        locale={locale}
                                    />
                                )}

                                {/* Invoice Details */}
                                <InvoiceDetailsSection
                                    reservation={reservation}
                                    locale={locale}
                                />
                                {/* Reservation Extensions */}
                                {reservation.reservationExtensions && reservation.reservationExtensions.length > 0 && (
                                    <>
                                        <ReservationExtensionsSection
                                            extensions={reservation.reservationExtensions}
                                            locale={locale}
                                        />
                                        {/* Reservation Totals (After Extensions) */}
                                        {/* {!isLoadingTotals && totals && (
                                            <ReservationTotalsSection
                                                totals={totals}
                                                locale={locale}
                                            />
                                        )} */}
                                    </>
                                )}




                                {/* Cancellation Reason */}
                                {/* <CancellationReasonSection
                                reservation={reservation}
                                locale={locale}
                            /> */}

                                {/* Invisible trigger div to detect when to switch to sticky */}
                                <div ref={stickyTriggerRef} className="h-1 w-full" aria-hidden="true" />
                            </div>

                            {/* Header at Bottom/Top - shows when original header is hidden */}
                            {showStickyHeader && (
                                <div
                                    className="z-50 bg-white shadow-lg border-t-2 border-[#ECEEF2]"
                                    style={headerStyle}
                                >
                                    <ReservationHeader
                                        reservationStatus={reservation.reservationStatus}
                                        reservationId={reservation.reservationId}
                                        locale={locale}
                                        currentEndDate={reservation.endDate}
                                        finalAmount={reservation.total}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

