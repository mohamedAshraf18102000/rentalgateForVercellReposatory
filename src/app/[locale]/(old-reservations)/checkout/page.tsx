import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeaderPage } from '@/app/(components)/template/HeaderPage';
import CheckoutPageClient from './CheckoutPageClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutPage({ params }: Props) {
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
      label: locale === 'ar' ? 'إتمام الحجز' : 'Checkout',
      href: '/checkout',
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <HeaderPage
        imageSrc="/shared/bgHeader.png"
        imageAlt="checkout"
        backButtonHref="/cars"
        breadcrumbItems={breadcrumbItems}
        locale={locale}
      />
      <CheckoutPageClient locale={locale} />
    </>
  );
}

