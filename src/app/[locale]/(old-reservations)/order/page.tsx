import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeaderPage } from '@/app/(components)/template/HeaderPage';
import OrderPageClient from './OrderPageClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OrderPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations('common');

  const breadcrumbItems = [
    {
      label: tCommon('home'),
      href: '/',
    },
    {
      label: tCommon('cars'),
      href: '/cars',
    },
    {
      label: locale === 'ar' ? 'تأكيد الحجز' : 'Order Confirmation',
      href: '/order',
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <HeaderPage
        imageSrc="/shared/bgHeader.png"
        imageAlt="order"
        backButtonHref="/cars"
        breadcrumbItems={breadcrumbItems}
        locale={locale}
      />
      <Suspense
        fallback={
          <div className="container-custom py-8 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          </div>
        }
      >
        <OrderPageClient locale={locale} />
      </Suspense>
    </>
  );
}

