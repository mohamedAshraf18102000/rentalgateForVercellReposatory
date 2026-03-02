/**
 * Filter Store - Zustand store for managing car filter state with cookies persistence
 * Complete rewrite for proper synchronization
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setCookie, getCookie } from '@/util/cookies';

type DurationType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface FilterState {
  // Filter state
  duration: DurationType;
  selectedDay: string;
  days: number;
  fromDate: Date | null;
  toDate: Date | null;
  
  // Actions
  setDuration: (duration: DurationType) => void;
  setDays: (days: number) => void;
  setFromDate: (date: Date | null) => void;
  setToDate: (date: Date | null) => void;
  setDaySelection: (date: Date) => void;
  
  // Helper actions
  initializeFromDates: (minDaysReservation: number) => void;
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
    date.setHours(0, 0, 0, 0);
    return date;
  } catch {
    return null;
  }
};

// Helper to ensure date is Date object
const ensureDate = (date: Date | string | null): Date | null => {
  if (!date) return null;
  if (date instanceof Date) {
    date.setHours(0, 0, 0, 0);
    return date;
  }
  if (typeof date === 'string') {
    return deserializeDate(date);
  }
  return null;
};

// Helper to calculate days from dates
const calculateDays = (fromDate: Date, toDate: Date): number => {
  const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper to calculate toDate from fromDate and days
// If fromDate is today and days = 1, toDate should be tomorrow (24 hours later)
const calculateToDate = (fromDate: Date, days: number): Date => {
  const toDate = new Date(fromDate);
  toDate.setDate(fromDate.getDate() + days);
  toDate.setHours(0, 0, 0, 0);
  return toDate;
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

const getInitialState = (): Omit<FilterState, 'setDuration' | 'setDays' | 'setFromDate' | 'setToDate' | 'setDaySelection' | 'initializeFromDates' | 'reset'> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const initialToDate = new Date(today);
  initialToDate.setDate(today.getDate() + 3);
  
  return {
    duration: 'daily',
    selectedDay: 'today',
    days: 4,
    fromDate: today,
    toDate: initialToDate,
  };
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setDuration: (duration: DurationType) => {
        // Helper to get multiplier for duration (how many days per unit)
        const getDaysPerUnit = (dur: DurationType): number => {
          switch (dur) {
            case 'daily': return 1;
            case 'weekly': return 7;
            case 'monthly': return 30;
            case 'yearly': return 365;
            default: return 1;
          }
        };

        const state = get();
        let fromDate = ensureDate(state.fromDate);
        
        // If no fromDate, initialize with today
        if (!fromDate) {
          fromDate = new Date();
          fromDate.setHours(0, 0, 0, 0);
        }

        // When changing duration, set displayed count to 1, but calculate actual days
        const daysPerUnit = getDaysPerUnit(duration);
        const actualDays = daysPerUnit; // 1 unit = daysPerUnit days

        // Calculate new toDate based on actual days
        const newToDate = calculateToDate(fromDate, actualDays);

        // Update everything at once
        // Store actual days in state, but UI will display 1 for non-daily durations
        set({
          duration,
          days: actualDays,
          fromDate,
          toDate: newToDate,
        });
      },

      setDays: (displayedCount: number) => {
        if (displayedCount < 1) return;
        
        const state = get();
        let fromDate = ensureDate(state.fromDate);
        
        // If no fromDate, initialize with today
        if (!fromDate) {
          fromDate = new Date();
          fromDate.setHours(0, 0, 0, 0);
        }

        // Helper to get multiplier for duration
        const getDaysPerUnit = (dur: DurationType): number => {
          switch (dur) {
            case 'daily': return 1;
            case 'weekly': return 7;
            case 'monthly': return 30;
            case 'yearly': return 365;
            default: return 1;
          }
        };

        // Convert displayed count to actual days based on duration
        const daysPerUnit = getDaysPerUnit(state.duration);
        const actualDays = displayedCount * daysPerUnit;

        // Calculate new toDate
        const newToDate = calculateToDate(fromDate, actualDays);

        // Update everything at once
        set({
          days: actualDays,
          fromDate,
          toDate: newToDate,
        });
      },

      setFromDate: (date: Date | null) => {
        const validDate = ensureDate(date);
        if (!validDate) return;
        
        const state = get();
        const days = state.days > 0 ? state.days : 1;

        // Calculate new toDate
        const newToDate = calculateToDate(validDate, days);

        // Update selectedDay
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayKey = validDate.toDateString() === today.toDateString() 
          ? 'today' 
          : validDate.toDateString();

        // Update everything at once
        set({
          fromDate: validDate,
          toDate: newToDate,
          selectedDay: dayKey,
          days: days, // Ensure days is set
        });
      },

      setToDate: (date: Date | null) => {
        const validToDate = ensureDate(date);
        if (!validToDate) return;
        
        const state = get();
        const fromDate = ensureDate(state.fromDate);
        
        if (!fromDate) {
          // If no fromDate, calculate it from toDate and days
          const days = state.days > 0 ? state.days : 1;
          const calculatedFromDate = new Date(validToDate);
          calculatedFromDate.setDate(validToDate.getDate() - (days - 1));
          calculatedFromDate.setHours(0, 0, 0, 0);
          
          set({
            fromDate: calculatedFromDate,
            toDate: validToDate,
            days,
          });
          return;
        }

        // Calculate days from dates
        const calculatedDays = calculateDays(fromDate, validToDate);

        // Helper to get multiplier for duration
        const getDaysPerUnit = (dur: DurationType): number => {
          switch (dur) {
            case 'daily': return 1;
            case 'weekly': return 7;
            case 'monthly': return 30;
            case 'yearly': return 365;
            default: return 1;
          }
        };

        // Convert calculated days to displayed count (round to nearest unit)
        const daysPerUnit = getDaysPerUnit(state.duration);
        const displayedCount = Math.max(1, Math.round(calculatedDays / daysPerUnit));
        const actualDays = displayedCount * daysPerUnit;

        // Update everything at once
        // Keep fromDate as is, update toDate and days
        set({
          fromDate,
          toDate: validToDate,
          days: actualDays,
        });
      },

      setDaySelection: (date: Date) => {
        const selectedDate = ensureDate(date);
        if (!selectedDate) return;
        
        const state = get();
        const days = state.days > 0 ? state.days : 1;

        // Calculate new toDate
        const newToDate = calculateToDate(selectedDate, days);

        // Update selectedDay
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayKey = selectedDate.toDateString() === today.toDateString() 
          ? 'today' 
          : selectedDate.toDateString();

        // Update everything at once
        set({
          selectedDay: dayKey,
          fromDate: selectedDate,
          toDate: newToDate,
          days,
        });
      },

      initializeFromDates: (minDaysReservation: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const state = get();
        const days = state.days > 0 ? state.days : 4;
        
        const newToDate = calculateToDate(today, days);
        
        set({
          fromDate: today,
          toDate: newToDate,
          days,
        });
      },

      reset: () => {
        set(getInitialState());
      },
    }),
    {
      name: 'car-filter-storage',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        duration: state.duration,
        selectedDay: state.selectedDay,
        days: state.days,
        fromDate: state.fromDate ? serializeDate(state.fromDate) : null,
        toDate: state.toDate ? serializeDate(state.toDate) : null,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating filter store:', error);
          return;
        }
        if (state) {
          // Convert ISO strings back to Date objects
          if (state.fromDate) {
            state.fromDate = ensureDate(state.fromDate);
          }
          if (state.toDate) {
            state.toDate = ensureDate(state.toDate);
          }
          
          // Ensure consistency after rehydration
          if (state.fromDate && state.toDate && state.days) {
            const calculatedDays = calculateDays(state.fromDate, state.toDate);
            if (calculatedDays !== state.days) {
              // Recalculate toDate based on fromDate and days
              state.toDate = calculateToDate(state.fromDate, state.days);
            }
          }
        }
      },
    }
  )
);
