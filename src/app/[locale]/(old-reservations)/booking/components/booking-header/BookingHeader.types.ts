/**
 * Booking Header Types
 * Types for the Booking Header component (used in booking page)
 */

export interface BookingHeaderProps {
  locale: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbItems: Array<{
    label: string;
    href: string;
    isCurrentPage?: boolean;
  }>;
}

