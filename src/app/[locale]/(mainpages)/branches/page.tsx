// import type { Metadata } from 'next';
// import { getTranslations } from 'next-intl/server';
// import { BookingHeader } from '../../(old-reservations)/booking/components/booking-header';
// import { BranchesClient } from './components/BranchesClient';

// interface BranchesPageProps {
//     params: Promise<{ locale: string }>;
// }

// export async function generateMetadata({ params }: BranchesPageProps): Promise<Metadata> {
//     const { locale } = await params;
//     const baseUrl = 'https://www.almqam.sa';
//     const isArabic = locale === 'ar';

//     return {
//         title: isArabic
//             ? 'فروعنا - رينتال جيت لتأجير السيارات | مواقع الفروع في السعودية'
//             : 'Our Branches - Rental Gate Car Rental | Branch Locations in Saudi Arabia',
//         description: isArabic
//             ? 'اكتشف فروع رينتال جيت لتأجير السيارات في جميع أنحاء المملكة العربية السعودية. نقدم خدمة تأجير السيارات في مكة وجدة مع أفضل الأسعار والخدمات.'
//             : 'Discover Rental Gate Car Rental branches throughout Saudi Arabia. We offer car rental services in Makkah and Jeddah with the best prices and services.',
//         keywords: isArabic
//             ? 'فروع رينتال جيت, مكاتب تأجير السيارات, فروع في مكة, فروع في جدة, تأجير سيارات السعودية'
//             : 'Rental Gate branches, car rental offices, branches in Makkah, branches in Jeddah, Saudi Arabia car rental',
//         alternates: {
//             canonical: `${baseUrl}/${locale}/branches`,
//             languages: {
//                 'ar': `${baseUrl}/ar/branches`,
//                 'en': `${baseUrl}/en/branches`,
//                 'x-default': `${baseUrl}/ar/branches`
//             }
//         },
//     };
// }

// export default async function BranchesPage({ params }: BranchesPageProps) {
//     const { locale } = await params;
//     const tCommon = await getTranslations('common');

//     const breadcrumbItems = [
//         {
//             label: tCommon('home'),
//             href: '/',
//         },
//         {
//             label: tCommon('branches'),
//             href: '/branches',
//             isCurrentPage: true,
//         },
//     ];

//     return (
//         <div>
//             <BookingHeader
//                 locale={locale}
//                 imageSrc="/shared/bgHeader.png"
//                 imageAlt="branches"
//                 breadcrumbItems={breadcrumbItems}
//             />
//             <BranchesClient locale={locale} />

//         </div>
//     );
// }

const generateMetadata = () => {
  return <div>page</div>;
};

export default generateMetadata;
