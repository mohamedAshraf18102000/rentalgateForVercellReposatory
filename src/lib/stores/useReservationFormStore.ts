import { create } from "zustand";

/**
 * Stores the reservation form data in memory (no persistence) so that
 * navigating between steps does NOT lose field values — especially the
 * licenceImage File object which cannot be serialised to JSON.
 */

interface ReservationFormData {
  // Step 2 – Tenant details
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  nationality: string;
  email: string;
  licenceImage: File | null;
  licenceExpiryDate: Date | null;

  // Step 3 – Services
  services: string[];
}

interface ReservationFormState {
  formData: ReservationFormData;
  setFormField: <K extends keyof ReservationFormData>(
    key: K,
    value: ReservationFormData[K],
  ) => void;
  resetForm: () => void;
}

const initialFormData: ReservationFormData = {
  fullName: "",
  phoneNumber: "",
  idNumber: "",
  nationality: "",
  email: "",
  licenceImage: null,
  licenceExpiryDate: null,
  services: [],
};

export const useReservationFormStore = create<ReservationFormState>((set) => ({
  formData: initialFormData,

  setFormField: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  resetForm: () => set({ formData: initialFormData }),
}));
