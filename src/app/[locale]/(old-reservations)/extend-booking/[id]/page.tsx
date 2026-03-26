// import { getTranslations } from 'next-intl/server';
// import ExtendBookingContent from './components/ExtendBookingContent';
// import { HeaderPage } from '@/app/(components)/template/HeaderPage';

// const page = async ({ 
//     params 
// }: { 
//     params: { locale: string; id: string } 
// }) => {
//     const { locale, id } = await params;
//     const tCommon = await getTranslations('common');

//     const breadcrumbItems = [
//         {
//             label: tCommon('home'),
//             href: '/',
//         },
//         {
//             label: tCommon('myBookings'),
//             href: '/profile/my-bookings',
//         },
//         {
//             label: tCommon('extendBooking'),
//             href: `/extend-booking/${id}`,
//             isCurrentPage: true,
//         },
//     ];

//     return (
//         <div>
//             <HeaderPage 
//                 imageSrc="/shared/bgHeader.png" 
//                 imageAlt="extend booking"
//                 backButtonHref={`/profile/my-bookings/${id}`}
//                 breadcrumbItems={breadcrumbItems}
//                 locale={locale}
//             />
//             <ExtendBookingContent 
//                 reservationId={parseInt(id)} 
//             />
//         </div>
//     );
// };

// export default page;


const page = () => {
  return (
    <div>page</div>
  )
}

export default page