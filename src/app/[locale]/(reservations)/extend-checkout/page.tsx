import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeaderPage } from '@/app/(components)/template/HeaderPage';
import ExtendCheckoutPageClient from './ExtendCheckoutPageClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ExtendCheckoutPage({ params }: Props) {
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
      label: locale === 'ar' ? 'إتمام التمديد' : 'Extension Checkout',
      href: '/extend-checkout',
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <HeaderPage
        imageSrc="/shared/bgHeader.png"
        imageAlt="extension checkout"
        backButtonHref="/profile/my-bookings"
        breadcrumbItems={breadcrumbItems}
        locale={locale}
      />
      <ExtendCheckoutPageClient locale={locale} />
    </>
  );
}
