/**
 * Car Data Store - Zustand store for managing car data (Arabic)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setCookie, getCookie } from '@/util/cookies';
import type { CarApiResponse } from '@/constants/api';

interface CarDataState {
  // Car data
  car: CarApiResponse | null;
  categoryText: string;
  locale: string;

  // Actions
  setCar: (car: CarApiResponse | null) => void;
  setCategoryText: (text: string) => void;
  setLocale: (locale: string) => void;
  reset: () => void;
}

// Custom storage for cookies
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return getCookie(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    setCookie(name, value, 30); // Save for 30 days
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    setCookie(name, '', -1);
  },
};

const getInitialState = (): Omit<CarDataState, 'setCar' | 'setCategoryText' | 'setLocale' | 'reset'> => {
  return {
    car: null,
    categoryText: '',
    locale: 'ar',
  };
};

export const useCarDataStore = create<CarDataState>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setCar: (car: CarApiResponse | null) => {
        set({ car });
      },

      setCategoryText: (text: string) => {
        set({ categoryText: text });
      },

      setLocale: (locale: string) => {
        set({ locale });
      },

      reset: () => {
        set(getInitialState());
      },
    }),
    {
      name: 'car-data-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

