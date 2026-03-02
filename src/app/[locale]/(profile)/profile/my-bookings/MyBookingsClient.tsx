'use client';

/**
 * My Bookings Page Client
 * Displays current and past reservations with tabs
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { getCurrentReservations, getFinishedReservations, Reservation } from '@/lib/api/reservations-list';
import ReservationCard from './components/ReservationCard';
import { Button } from '@/app/(components)/ui/button';
import Image from 'next/image';

interface MyBookingsClientProps {
    locale: string;
    token?: string | null;
}

export default function MyBookingsClient({ locale, token }: MyBookingsClientProps) {
    const t = useTranslations('common');
    const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
    const [currentReservations, setCurrentReservations] = useState<Reservation[]>([]);
    const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayedCount, setDisplayedCount] = useState(9);
    const isArabic = locale === 'ar';
    const itemsPerPage = 9;

    useEffect(() => {
        async function fetchReservations() {
            // Don't fetch if no token - RouteGuard will handle authentication
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                if (activeTab === 'current') {
                    const response = await getCurrentReservations(token);
                    if (response.message === 'SUCCESS') {
                        setCurrentReservations(response.data || []);
                    }
                } else {
                    const response = await getFinishedReservations(token);
                    if (response.message === 'SUCCESS') {
                        setPastReservations(response.data || []);
                    }
                }
            } catch (err) {
                console.error('Error fetching reservations:', err);
                setError(isArabic ? 'حدث خطأ أثناء تحميل الحجوزات' : 'Error loading reservations');
            } finally {
                setLoading(false);
            }
        }

        fetchReservations();
        // Reset displayed count when tab changes
        setDisplayedCount(itemsPerPage);
    }, [activeTab, token, isArabic]);

    const allReservations = activeTab === 'current' ? currentReservations : pastReservations;
    const displayReservations = allReservations.slice(0, displayedCount);
    const totalCount = allReservations.length;
    const hasMore = displayedCount < allReservations.length;
    const startIndex = displayReservations.length > 0 ? 1 : 0;
    const endIndex = displayedCount;

    const handleLoadMore = () => {
        setDisplayedCount((prev) => Math.min(prev + itemsPerPage, allReservations.length));
    };

    return (
        <div className="container-custom py-8" dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Bookings Card with Tabs - Same design as image */}
            <div className="w-[516px] max-md:w-full mx-auto -mt-15 z-10">
                <div className="bg-white rounded-2xl  shadow-[0px_2px_8px_0px_#5858581A]  p-3 relative">
                    {/* Header with Badge and Title */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                            {isArabic ? 'حجوزاتي' : 'My Reservations'}
                        </h1>
                        <div className="bg-black text-white rounded-full px-3 py-1.5 text-sm font-bold min-w-[40px] text-center">
                            {totalCount.toString().padStart(2, '0')}
                        </div>
                    </div>

                    {/* Tabs - Same design as image */}
                    <div className="flex gap-2 p-[6px] rounded-[12px] bg-[#ECEEF2]">
                        <button
                            onClick={() => setActiveTab('current')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm md:text-base ${activeTab === 'current'
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                : 'hover:bg-gray-200'
                                }`}
                        >
                            {isArabic ? 'حجوزات الحالية' : 'Current Reservations'}
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm md:text-base ${activeTab === 'past'
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                                : 'hover:bg-gray-200'
                                }`}
                        >
                            {isArabic ? 'حجوزات سابقة' : 'Past Reservations'}
                        </button>
                    </div>
                </div>

            </div>
            {/* Reservations List - Grid with 3 columns */}
            <div className="mt-6 max-w-7xl mx-auto px-4">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : displayReservations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center gap-4">
                        <Image src="/notfound.png" alt="No Reservations" width={250} height={250} />
                        <p className="text-gray-500 text-lg">
                            {activeTab === 'current'
                                ? isArabic
                                    ? 'لا توجد حجوزات حالية'
                                    : 'No current reservations'
                                : isArabic
                                    ? 'لا توجد حجوزات سابقة'
                                    : 'No past reservations'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-[50px]">
                            {displayReservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.reservationId}
                                    reservation={reservation}
                                    locale={locale}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="flex flex-col items-center gap-4 mt-8">
                                <Button
                                    onClick={handleLoadMore}
                                    variant="default"
                                    size="lg"
                                    className="bg-primary hover:bg-primary-hover text-white"
                                >
                                    {isArabic ? 'تحميل المزيد' : 'Load More'}
                                </Button>
                                <p className="text-sm text-gray-600">
                                    {isArabic
                                        ? `الحجوزات الظاهرة: ${startIndex}-${endIndex} من أصل ${totalCount}`
                                        : `Displayed reservations: ${startIndex}-${endIndex} out of ${totalCount}`
                                    }
                                </p>
                            </div>
                        )}

                        {!hasMore && allReservations.length > 0 && (
                            <div className="text-center mt-8">
                                <p className="text-sm text-gray-600">
                                    {isArabic
                                        ? `الحجوزات الظاهرة: ${startIndex}-${totalCount} من أصل ${totalCount}`
                                        : `Displayed reservations: ${startIndex}-${totalCount} out of ${totalCount}`
                                    }
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

