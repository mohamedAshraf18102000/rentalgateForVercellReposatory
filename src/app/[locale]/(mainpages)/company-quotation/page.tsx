import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BookingHeader } from '../../(old-reservations)/booking/components/booking-header';
import { CompanyQuotationForm } from './components/CompanyQuotationForm';

interface CompanyQuotationPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CompanyQuotationPageProps): Promise<Metadata> {
    const { locale } = await params;
    const baseUrl = 'https://www.almqam.sa';
    const isArabic = locale === 'ar';

    return {
        title: isArabic
            ? 'عروض الشركات - رينتال جيت لتأجير السيارات | طلب عرض سعر للشركات'
            : 'Company Quotation - Rental Gate Car Rental | Request Company Quote',
        description: isArabic
            ? 'اطلب عرض سعر خاص لشركتك من رينتال جيت لتأجير السيارات. نقدم أفضل عروض تأجير السيارات للشركات والمؤسسات في السعودية.'
            : 'Request a special quote for your company from Rental Gate Car Rental. We offer the best car rental deals for companies and institutions in Saudi Arabia.',
        keywords: isArabic
            ? 'عروض الشركات, تأجير سيارات للشركات, عرض سعر, تأجير سيارات السعودية'
            : 'company quotes, corporate car rental, quotation request, Saudi Arabia car rental',
        alternates: {
            canonical: `${baseUrl}/${locale}/company-quotation`,
            languages: {
                'ar': `${baseUrl}/ar/company-quotation`,
                'en': `${baseUrl}/en/company-quotation`,
                'x-default': `${baseUrl}/ar/company-quotation`
            }
        },
    };
}

export default async function CompanyQuotationPage({ params }: CompanyQuotationPageProps) {
    const { locale } = await params;
    const tCommon = await getTranslations('common');

    const breadcrumbItems = [
        {
            label: tCommon('home'),
            href: '/',
        },
        {
            label: locale === 'ar' ? 'عروض الشركات' : 'Company Quotation',
            href: '/company-quotation',
            isCurrentPage: true,
        },
    ];

    return (
        <div>
            <BookingHeader
                locale={locale}
                imageSrc="/shared/bgHeader.png"
                imageAlt="company-quotation"
                breadcrumbItems={breadcrumbItems}
            />
            <CompanyQuotationForm locale={locale} />
        </div>
    );
}