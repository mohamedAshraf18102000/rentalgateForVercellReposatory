/**
 * Available Services Types
 * Types for the Available Services component
 */

export interface Service {
  serviceId: number;
  nameEnglish: string;
  nameArabic: string;
  serviceType: string;
  serviceAvailability: string;
  iconUrl: string | null;
  detailsEnglish: string | null;
  detailsArabic: string | null;
  price: number;
  notes: string | null;
}

export interface ServicesApiResponse {
  message: string;
  data: Service[];
}

export interface AvailableServicesProps {
  locale: string;
  selectedServices?: number[];
  onServiceToggle?: (serviceId: number) => void;
  onServicesLoaded?: (loaded: boolean) => void;
}

