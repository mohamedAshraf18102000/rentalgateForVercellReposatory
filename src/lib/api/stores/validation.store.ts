/**
 * Validation Store - Zustand store for managing booking validation data
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setCookie, getCookie } from '@/util/cookies'; 
import type { ReservationForOtherData } from '@/app/[locale]/(reservations)/booking/components/reservation-for-other'; 

interface ValidationState {
  // Booking validation data
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string;
  dropoffTime: string;
  pickupLocation: 'branch' | 'location';
  fromBranch: number | null; // Branch ID for pickup
  toBranch: number | null; // Branch ID for dropoff
  extraServices: number[]; // Selected service IDs
  carExtraKmQuota: number | null; // Selected km package ID
  promoCode: string | null; // Promo code for discount
  isInsuranceSelected: boolean; // Comprehensive insurance selection
  selectedPoints: number; // Selected reward points
  reservationForOther: ReservationForOtherData | null; // Reservation for another person

  // Actions
  setPickupDate: (date: Date | null) => void;
  setDropoffDate: (date: Date | null) => void;
  setPickupTime: (time: string) => void;
  setDropoffTime: (time: string) => void;
  setPickupLocation: (location: 'branch' | 'location') => void;
  setFromBranch: (branchId: number | null) => void;
  setToBranch: (branchId: number | null) => void;
  setExtraServices: (services: number[]) => void;
  setCarExtraKmQuota: (kmId: number | null) => void;
  setPromoCode: (code: string | null) => void;
  setIsInsuranceSelected: (isSelected: boolean) => void;
  setSelectedPoints: (points: number) => void;
  setReservationForOther: (data: ReservationForOtherData | null) => void;
  reset: () => void;
}

// Helper functions for date serialization
const serializeDate = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString();
};

const deserializeDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
};

// Helper to get current time rounded to nearest 30 minutes
const getCurrentTimeRounded = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;
  if (roundedMinutes >= 60) {
    const finalHours = (hours + 1) % 24;
    const finalMinutes = roundedMinutes % 60;
    return `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
  }
  return `${hours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
};

// Custom storage for cookies
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return getCookie(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    setCookie(name, value, 30);
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    setCookie(name, '', -1);
  },
};

const getInitialState = (): Omit<ValidationState, 'setPickupDate' | 'setDropoffDate' | 'setPickupTime' | 'setDropoffTime' | 'setPickupLocation' | 'setFromBranch' | 'setToBranch' | 'setExtraServices' | 'setCarExtraKmQuota' | 'setPromoCode' | 'setIsInsuranceSelected' | 'setSelectedPoints' | 'setReservationForOther' | 'reset'> => {
  return {
    pickupDate: null,
    dropoffDate: null,
    pickupTime: getCurrentTimeRounded(),
    dropoffTime: getCurrentTimeRounded(),
    pickupLocation: 'branch',
    fromBranch: null,
    toBranch: null,
    extraServices: [],
    carExtraKmQuota: null,
    promoCode: null,
    isInsuranceSelected: false,
    selectedPoints: 0,
    reservationForOther: null,
  };
};

export const useValidationStore = create<ValidationState>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setPickupDate: (date: Date | null) => {
        set({ pickupDate: date });
      },

      setDropoffDate: (date: Date | null) => {
        set({ dropoffDate: date });
      },

      setPickupTime: (time: string) => {
        set({ pickupTime: time });
      },

      setDropoffTime: (time: string) => {
        set({ dropoffTime: time });
      },

      setPickupLocation: (location: 'branch' | 'location') => {
        set({ pickupLocation: location });
      },

      setFromBranch: (branchId: number | null) => {
        set({ fromBranch: branchId });
      },

      setToBranch: (branchId: number | null) => {
        set({ toBranch: branchId });
      },

      setExtraServices: (services: number[]) => {
        set({ extraServices: services });
      },

      setCarExtraKmQuota: (kmId: number | null) => {
        set({ carExtraKmQuota: kmId });
      },

      setPromoCode: (code: string | null) => {
        set({ promoCode: code });
      },

      setIsInsuranceSelected: (isSelected: boolean) => {
        set({ isInsuranceSelected: isSelected });
      },

      setSelectedPoints: (points: number) => {
        set({ selectedPoints: points });
      },

      setReservationForOther: (data: ReservationForOtherData | null) => {
        set({ reservationForOther: data });
      },

      reset: () => {
        set(getInitialState());
      },
    }),
    {
      name: 'booking-validation-storage',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        pickupDate: state.pickupDate ? serializeDate(state.pickupDate) : null,
        dropoffDate: state.dropoffDate ? serializeDate(state.dropoffDate) : null,
        pickupTime: state.pickupTime,
        dropoffTime: state.dropoffTime,
        pickupLocation: state.pickupLocation,
        fromBranch: state.fromBranch,
        toBranch: state.toBranch,
        extraServices: state.extraServices,
        carExtraKmQuota: state.carExtraKmQuota,
        promoCode: state.promoCode,
        isInsuranceSelected: state.isInsuranceSelected,
        selectedPoints: state.selectedPoints,
        reservationForOther: state.reservationForOther,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating validation store:', error);
          return;
        }
        if (state) {
          // Convert ISO strings back to Date objects
          if (state.pickupDate) {
            state.pickupDate = deserializeDate(state.pickupDate as any);
          }
          if (state.dropoffDate) {
            state.dropoffDate = deserializeDate(state.dropoffDate as any);
          }
        }
      },
    }
  )
);

