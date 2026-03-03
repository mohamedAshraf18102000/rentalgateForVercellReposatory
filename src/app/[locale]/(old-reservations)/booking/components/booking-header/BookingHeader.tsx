'use client';

/**
 * Booking Header Component
 * Header component for the booking page with breadcrumb navigation
 */

import { useRouter } from '@/i18n/routing';
import { HeaderPage } from '@/app/(components)/template/HeaderPage';
import type { BookingHeaderProps } from './BookingHeader.types';

export function BookingHeader({ locale, imageSrc, imageAlt, breadcrumbItems }: BookingHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <HeaderPage
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      backButtonHref="/cars"
      breadcrumbItems={breadcrumbItems}
      locale={locale}
      onBackClick={handleBack}
    />
  );
}

