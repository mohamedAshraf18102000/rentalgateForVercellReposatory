import { HeaderPage } from '@/app/(components)/template/HeaderPage'
import React from 'react'
import { getTranslations } from 'next-intl/server';
import MyBookingsClient from './MyBookingsClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const tCommon = await getTranslations('common');
    const { locale } = await params;
    
    // Get token from cookies (optional - middleware will handle protection)
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    
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
            isCurrentPage: true,
        },
    ];
    
    return (
        <div>
            <HeaderPage
                imageSrc="/shared/bgHeader.png"
                imageAlt="my-bookings"
                backButtonHref="/"
                breadcrumbItems={breadcrumbItems}
                locale={locale}
            />
            <MyBookingsClient locale={locale} token={token} />
        </div>
    )
}

export default page