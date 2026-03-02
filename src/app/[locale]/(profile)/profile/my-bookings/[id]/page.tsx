'use client';

import { HeaderPage } from '@/app/(components)/template/HeaderPage'
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getReservationDetails } from '@/lib/api/reservation-details';
import ReservationDetailsClient from './ReservationDetailsClient';
import { getAuthToken } from '@/util/auth';
import type { ReservationDetails } from '@/lib/api/reservation-details';

export default function Page() {
    const tCommon = useTranslations('common');
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    const id = params.id as string;
    
    const [reservation, setReservation] = useState<ReservationDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
    // Get token from cookies
        const token = getAuthToken();
    
    // Redirect to login if no token
    if (!token) {
            router.push(`/${locale}/login`);
            return;
    }

    // Fetch reservation details
        const fetchReservation = async () => {
            setIsLoading(true);
            setError(null);
    
    try {
        const response = await getReservationDetails(parseInt(id), token);
        if (response.message === 'SUCCESS') {
                    setReservation(response.data);
                } else {
                    setError(locale === 'ar' ? 'الحجز غير موجود' : 'Reservation not found');
        }
    } catch (err) {
        console.error('Error fetching reservation details:', err);
                setError(locale === 'ar' ? 'حدث خطأ أثناء تحميل تفاصيل الحجز' : 'Error loading reservation details');
            } finally {
                setIsLoading(false);
    }
        };

        fetchReservation();
    }, [id, locale, router]);
    
    const breadcrumbItems = [
        {
            label: tCommon('home'),
            href: '/',
        },
        {
            label: locale === 'ar' ? 'حسابي' : 'My Account',
            href: '/profile',
        },
        {
            label: locale === 'ar' ? 'حجوزاتي' : 'My Reservations',
            href: '/profile/my-bookings',
        },
        {
            label: locale === 'ar' ? `حجز #${id}` : `Reservation #${id}`,
            href: `/profile/my-bookings/${id}`,
            isCurrentPage: true,
        },
    ];
    
    const token = getAuthToken();
    
    if (isLoading) {
        return (
            <div>
                <HeaderPage
                    imageSrc="/shared/bgHeader.png"
                    imageAlt="my-bookings"
                    backButtonHref="/profile/my-bookings"
                    breadcrumbItems={breadcrumbItems}
                    locale={locale}
                />
                <div className="container-custom py-8">
                    <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                        <p className="text-gray-500">
                            {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <HeaderPage
                imageSrc="/shared/bgHeader.png"
                imageAlt="my-bookings"
                backButtonHref="/profile/my-bookings"
                breadcrumbItems={breadcrumbItems}
                locale={locale}
            />
            
            {error ? (
                <div className="container-custom py-8">
                    <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                        <p className="text-red-500">{error}</p>
                    </div>
                </div>
            ) : !reservation ? (
                <div className="container-custom py-8">
                    <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                        <p className="text-gray-500">
                            {locale === 'ar' ? 'الحجز غير موجود' : 'Reservation not found'}
                        </p>
                    </div>
                </div>
            ) : (
                <ReservationDetailsClient reservation={reservation} locale={locale} token={token || ''} reservationId={id} />
            )}
        </div>
    );
}