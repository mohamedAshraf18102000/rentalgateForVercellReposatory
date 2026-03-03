/**
 * Hook for form validation
 * Checks if all required booking fields are filled
 */

import { useMemo } from 'react';
import { useValidationStore } from '@/lib/api/stores';

export const useFormValidation = () => {
  const {
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
    fromBranch,
  } = useValidationStore();

  const isFormValid = useMemo(() => {
    return !!(
      pickupDate &&
      dropoffDate &&
      pickupTime &&
      dropoffTime &&
      fromBranch
    );
  }, [pickupDate, dropoffDate, pickupTime, dropoffTime, fromBranch]);

  return isFormValid;
};

