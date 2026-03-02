import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeaderPage } from '../../../(components)/template/HeaderPage';
import { CarsFilterWrapper } from './components/CarsFilterWrapper';
import { CarsPageClient } from './components/CarsPageClient';
import { fetchCarsData, type CarCardData } from '@/constants/api';
import { getSharedData } from '@/lib/api/services';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ branchId?: string }>;
};

export default async function CarsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    const urlParams = await searchParams;
    setRequestLocale(locale);

    const tCommon = await getTranslations('common');
    
    // Parse branchId from URL if provided
    const branchId = urlParams.branchId ? parseInt(urlParams.branchId, 10) : undefined;

    // جلب البيانات من API
    let cars: CarCardData[] = [];
    let sharedData = null;
    try {
        [cars, sharedData] = await Promise.all([
            fetchCarsData(locale),
            getSharedData(),
        ]);
    } catch (error) {
        console.error('Error fetching data:', error);
        cars = [];
    }

    return (
        <>
            <HeaderPage
                imageSrc="/shared/bgHeader.png"
                imageAlt="cars"
                backButtonHref="/"
                breadcrumbItems={[
                    {
                        label: tCommon('home'),
                        href: '/',
                    },
                    {
                        label: tCommon('carList'),
                        href: '/cars',
                        isCurrentPage: true,
                    },
                ]}
                locale={locale}
            />
            {/* Filter Cars */}
            <div className="container-custom">
                <CarsPageClient locale={locale} />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                    <CarsFilterWrapper
                        initialCars={cars}
                        carTypes={sharedData?.data.carTypes || []}
                        locale={locale}
                        initialBranchId={branchId}
                    />
                </div>
            </div>
        </>
    );
}

