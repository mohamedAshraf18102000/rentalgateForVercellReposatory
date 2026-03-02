import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { fetchCarById, type CarApiResponse } from '@/constants/api';
import { CarDetailsContent } from './car-details/CarDetailsContent';
import { HeaderPage } from '@/app/(components)/template/HeaderPage';
import { FirstBookingCheck } from './completed-data/FirstBookingCheck'  ;

type Props = {
    params: Promise<{ locale: string; id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CarDetailsPage({ params, searchParams }: Props) {
    const { locale, id } = await params;
    const search = await searchParams;
    setRequestLocale(locale);

    const tCommon = await getTranslations('common');
    const tCarDetails = await getTranslations('carDetails');

    // Parse car ID
    const carId = parseInt(id, 10);
    if (isNaN(carId)) {
        notFound();
    }

    // Prepare API params
    const apiParams: {
        datingType?: number;
        startDate?: string;
        endDate?: string;
        cityId?: number;
        branchId?: number;
    } = {};

    if (search.datingType) {
        apiParams.datingType = parseInt(search.datingType as string, 10);
    }
    if (search.startDate) {
        apiParams.startDate = search.startDate as string;
    }
    if (search.endDate) {
        apiParams.endDate = search.endDate as string;
    }
    if (search.cityId) {
        apiParams.cityId = parseInt(search.cityId as string, 10);
    }
    if (search.branchId) {
        apiParams.branchId = parseInt(search.branchId as string, 10);
    }

    // Fetch car data
    let car: CarApiResponse;
    try {
        car = await fetchCarById(carId, apiParams);
    } catch (error) {
        console.error('Error fetching car:', error);
        notFound();
    }

    return (
        <>
            <FirstBookingCheck locale={locale} />
            <HeaderPage
                imageSrc="/shared/bgHeader.png"
                imageAlt="car details"
                backButtonHref="/cars"
                breadcrumbItems={[
                    {
                        label: tCommon('home'),
                        href: '/',
                    },
                    {
                        label: tCommon('carList'),
                        href: '/cars',
                    },
                    {
                        label: tCarDetails('title'),
                        href: `/cars/${id}`,
                        isCurrentPage: true,
                    },
                ]}
                locale={locale}
            />
            <CarDetailsContent car={car} locale={locale} searchParams={search} />
        </>
    );
}

