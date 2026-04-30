import { useEffect } from "react";
import { BookingFilters } from "@/lib/stores/useUserPreferedFiltersStore";
import { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";
import {
  buildInitialReservationValues,
  mapValuesToFormData,
} from "./stepContentFormValues";

const mapFilterLocationTypeToReservationType = (
  type?: BookingFilters["pickupType"] | BookingFilters["carReturnLocationType"],
): ReservationFormData["pickupType"] => {
  switch (type) {
    case "branches":
      return "BRANCH";
    case "currentLocation":
      return "MY_LOCATION";
    case "airport":
      return "AIRPORT";
    case "trainStation":
      return "TRAIN_STATION";
    default:
      return null;
  }
};

interface SyncStoreToFormParams {
  filters: BookingFilters;
  setValue: (name: keyof ReservationFormValues, value: unknown) => void;
  getValues: (name: keyof ReservationFormValues) => unknown;
}

export const useHydratedFormReset = ({
  hasHydrated,
  formData,
  filters,
  isForOtherReservation,
  reset,
}: {
  hasHydrated: boolean;
  formData: ReservationFormData;
  filters: BookingFilters;
  isForOtherReservation: boolean;
  reset: (
    values: ReservationFormValues,
    options?: { keepErrors?: boolean },
  ) => void;
}) => {
  useEffect(() => {
    if (!hasHydrated) return;
    reset(buildInitialReservationValues({ formData, filters, isForOtherReservation }), {
      keepErrors: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);
};

export const useSyncStoreToForm = ({
  filters,
  setValue,
  getValues,
}: SyncStoreToFormParams) => {
  useEffect(() => {
    if (filters.fromDate) {
      const storeDate = new Date(filters.fromDate);
      const formDate = getValues("fromDate") as Date | undefined;
      if (!formDate || storeDate.getTime() !== formDate.getTime()) {
        setValue("fromDate", storeDate);
      }
    }

    if (filters.toDate) {
      const storeDate = new Date(filters.toDate);
      const formDate = getValues("toDate") as Date | undefined;
      if (!formDate || storeDate.getTime() !== formDate.getTime()) {
        setValue("toDate", storeDate);
      }
    }

    if (filters.pickupId && filters.pickupId !== getValues("pickupId")) {
      setValue("pickupId", filters.pickupId);
    }

    if (
      filters.carReturnLocationId &&
      filters.carReturnLocationId !== getValues("carReturnLocationId")
    ) {
      setValue("carReturnLocationId", filters.carReturnLocationId);
    }

    if (
      (filters.pickupTrainId || null) !== (getValues("pickupTrainId") || null)
    ) {
      setValue("pickupTrainId", filters.pickupTrainId || null);
    }
    if (
      (filters.pickupAirportId || null) !== (getValues("pickupAirportId") || null)
    ) {
      setValue("pickupAirportId", filters.pickupAirportId || null);
    }
    if (
      (filters.carReturnTrainId || null) !== (getValues("returnTrainId") || null)
    ) {
      setValue("returnTrainId", filters.carReturnTrainId || null);
    }
    if (
      (filters.carReturnAirportId || null) !==
      (getValues("returnAirportId") || null)
    ) {
      setValue("returnAirportId", filters.carReturnAirportId || null);
    }
  }, [filters, setValue, getValues]);
};

export const usePrefillLocationAfterReset = ({
  hasHydrated,
  address,
  latitude,
  longitude,
  getValues,
  setValue,
  setFormData,
}: {
  hasHydrated: boolean;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  getValues: (name: keyof ReservationFormValues) => unknown;
  setValue: (name: keyof ReservationFormValues, value: unknown, options?: { shouldValidate?: boolean }) => void;
  setFormData: (data: Partial<ReservationFormData>) => void;
}) => {
  useEffect(() => {
    if (!hasHydrated) return;
    if (!address || latitude == null || longitude == null) return;

    const pickupName = getValues("pickupName");
    const carReturnLocation = getValues("carReturnLocation");
    const pickupLat = getValues("pickupLat");
    const pickupLong = getValues("pickupLong");
    const returnLat = getValues("returnLat");
    const returnLong = getValues("returnLong");
    const pickupId = getValues("pickupId");
    const carReturnLocationId = getValues("carReturnLocationId");

    const shouldPrefillPickup =
      !pickupName && !pickupId && (pickupLat == null || pickupLong == null);
    const shouldPrefillReturn =
      !carReturnLocation &&
      !carReturnLocationId &&
      (returnLat == null || returnLong == null);

    if (!shouldPrefillPickup && !shouldPrefillReturn) return;

    const update: Partial<ReservationFormData> = {};

    if (shouldPrefillPickup) {
      setValue("pickupName", address, { shouldValidate: true });
      setValue("pickupLat", latitude);
      setValue("pickupLong", longitude);
      setValue("pickupId", null);
      update.pickupName = address;
      update.pickupLat = latitude;
      update.pickupLong = longitude;
      update.pickupId = null;
      update.pickupType = "MY_LOCATION";
    }

    if (shouldPrefillReturn) {
      setValue("carReturnLocation", address, { shouldValidate: true });
      setValue("returnLat", latitude);
      setValue("returnLong", longitude);
      setValue("carReturnLocationId", null);
      update.carReturnLocation = address;
      update.returnLat = latitude;
      update.returnLong = longitude;
      update.carReturnLocationId = null;
      update.returnType = "MY_LOCATION";
    }

    if (Object.keys(update).length > 0) {
      setFormData(update);
    }
  }, [address, latitude, longitude, hasHydrated, getValues, setValue, setFormData]);
};

export const useSyncFormToStores = ({
  hasHydrated,
  getValues,
  watch,
  setFormData,
  filters,
  setFilter,
}: {
  hasHydrated: boolean;
  getValues: () => ReservationFormValues;
  watch: (callback: (value: Partial<ReservationFormValues>) => void) => {
    unsubscribe: () => void;
  };
  setFormData: (data: Partial<ReservationFormData>) => void;
  filters: BookingFilters;
  setFilter: <K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) => void;
}) => {
  useEffect(() => {
    if (!hasHydrated) return;
    const mappedPickupType = mapFilterLocationTypeToReservationType(
      filters.pickupType,
    );
    const mappedReturnType = mapFilterLocationTypeToReservationType(
      filters.carReturnLocationType,
    );

    setFormData({
      ...mapValuesToFormData(getValues()),
      // Do not reset store type to null when filter type is unset.
      pickupType: mappedPickupType || undefined,
      returnType: mappedReturnType || undefined,
    });

    const subscription = watch((value) => {
      setFormData(mapValuesToFormData(value));

      if (value.fromDate) {
        const formattedFromDate = formatLocalDateTime(value.fromDate);
        if (formattedFromDate && filters.fromDate !== formattedFromDate) {
          setFilter("fromDate", formattedFromDate);
        }
      }
      if (value.toDate) {
        const formattedToDate = formatLocalDateTime(value.toDate);
        if (formattedToDate && filters.toDate !== formattedToDate) {
          setFilter("toDate", formattedToDate);
        }
      }
      if (
        value.pickupTrainId !== undefined &&
        filters.pickupTrainId !== value.pickupTrainId
      ) {
        setFilter("pickupTrainId", value.pickupTrainId as number);
      }
      if (
        value.pickupAirportId !== undefined &&
        filters.pickupAirportId !== value.pickupAirportId
      ) {
        setFilter("pickupAirportId", value.pickupAirportId as number);
      }
      if (
        value.returnTrainId !== undefined &&
        filters.carReturnTrainId !== value.returnTrainId
      ) {
        setFilter("carReturnTrainId", value.returnTrainId as number);
      }
      if (
        value.returnAirportId !== undefined &&
        filters.carReturnAirportId !== value.returnAirportId
      ) {
        setFilter("carReturnAirportId", value.returnAirportId as number);
      }

      if (value.pickupName && value.pickupName !== "الموقع الحالي") {
        if (filters.pickupName !== value.pickupName) {
          setFilter("pickupName", value.pickupName);
        }
      }
      if (
        value.carReturnLocation &&
        value.carReturnLocation !== "الموقع الحالي"
      ) {
        if (filters.carReturnLocation !== value.carReturnLocation) {
          setFilter("carReturnLocation", value.carReturnLocation);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [hasHydrated, getValues, watch, setFormData, filters, setFilter]);
};
