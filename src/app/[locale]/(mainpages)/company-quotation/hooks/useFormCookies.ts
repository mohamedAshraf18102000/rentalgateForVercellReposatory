import { useCallback, useEffect, useRef } from "react";
import { setCookie, getCookie, deleteCookie } from "@/util/cookies";

const FORM_COOKIE_KEY = "company-quotation-form";
const STEP_COOKIE_KEY = "company-quotation-step";

export interface FormData {
  companyName: string;
  activity: string;
  city: string;
  responsibleName: string;
  phone: string;
  email: string;
  rentalDuration: number;
  selectedBrandId: string[];
  numberOfCars: number;
}

export function useFormCookies() {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved form data
  const loadFormData = useCallback((): Partial<FormData> => {
    try {
      const saved = getCookie(FORM_COOKIE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure numeric fields are numbers
        if (parsed.rentalDuration !== undefined) {
          parsed.rentalDuration = Number(parsed.rentalDuration) || 1;
        }
        if (parsed.numberOfCars !== undefined) {
          parsed.numberOfCars = Number(parsed.numberOfCars) || 1;
        }
        return parsed;
      }
    } catch (error) {
      console.error("Error loading form data:", error);
    }
    return {};
  }, []);

  // Load saved step
  const loadStep = useCallback((): number => {
    try {
      const saved = getCookie(STEP_COOKIE_KEY);
      if (saved) {
        const step = parseInt(saved, 10);
        if (step >= 1 && step <= 3) {
          return step;
        }
      }
    } catch (error) {
      console.error("Error loading step:", error);
    }
    return 1;
  }, []);

  // Save form data with debounce
  const saveFormData = useCallback((data: Partial<FormData>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        setCookie(FORM_COOKIE_KEY, JSON.stringify(data), 7);
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    }, 300); // Debounce for 300ms
  }, []);

  // Save step
  const saveStep = useCallback((step: number) => {
    try {
      setCookie(STEP_COOKIE_KEY, step.toString(), 7);
    } catch (error) {
      console.error("Error saving step:", error);
    }
  }, []);

  // Clear all cookies
  const clearCookies = useCallback(() => {
    try {
      deleteCookie(FORM_COOKIE_KEY);
      deleteCookie(STEP_COOKIE_KEY);
    } catch (error) {
      console.error("Error clearing cookies:", error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    loadFormData,
    loadStep,
    saveFormData,
    saveStep,
    clearCookies,
  };
}

