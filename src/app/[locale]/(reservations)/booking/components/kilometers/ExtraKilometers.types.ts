/**
 * Extra Kilometers Types
 * Types for the Extra Kilometers component
 */

export interface ExtraKm {
  kmId: number;
  carId: number;
  km: number;
  price: number;
}

export interface ExtraKmsApiResponse {
  message: string;
  // New API format: data is directly an array
  data: ExtraKm[] | {
    // Old API format: data.content is an array (backward compatibility)
    content: ExtraKm[];
    totalPages: number;
    totalElements: number;
    size: number;
    page: number;
    empty: boolean;
  };
}

export interface ExtraKilometersProps {
  locale: string;
  carId?: number;
  selectedKmId?: number | null;
  onKmChange?: (kmId: number | null) => void;
  onKmsLoaded?: (loaded: boolean) => void;
}

