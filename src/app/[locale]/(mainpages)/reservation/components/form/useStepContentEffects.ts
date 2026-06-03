import { useEffect, useRef } from "react";
import { BookingFilters } from "@/lib/stores/useUserPreferedFiltersStore";
import {
  ReservationFormData,
  useBookedCarDetailsStore,
} from "@/lib/stores/useBookedCarDetailsStore";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { isCurrentLocationPlaceholder } from "@/lib/validations/currentLocationLabels";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";
import {
  buildInitialReservationValues,
  mapValuesToFormData,
} from "./stepContentFormValues";
import {
  enrichBranchCoordinatesFromCar,
  sessionFiltersToPickupReservationPatch,
  sessionFiltersToReturnReservationPatch,
} from "@/lib/booking/sessionFiltersLocationPatch";

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
  filters,
  isForOtherReservation,
  reset,
  reconcileFormData,
}: {
  hasHydrated: boolean;
  filters: BookingFilters;
  isForOtherReservation: boolean;
  reset: (
    values: ReservationFormValues,
    options?: { keepErrors?: boolean },
  ) => void;
  reconcileFormData: () => void;
}) => {
  useEffect(() => {
    if (!hasHydrated) return;
    // Normalize persisted / partial state before RHF reset (single source: Zustand).
    reconcileFormData();
    reset(
      buildInitialReservationValues({
        formData: useBookedCarDetailsStore.getState().formData,
        filters,
        isForOtherReservation,
      }),
      {
        keepErrors: false,
      },
    );
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

    // Only mirror filter ids when the session filter mode matches — avoids resurrecting
    // airport/train ids after the user switched to another location type in the dialog.
    if (filters.pickupType === "branches" || filters.pickupType === "currentLocation") {
      if (filters.pickupId && filters.pickupId !== getValues("pickupId")) {
        setValue("pickupId", filters.pickupId);
      }
    }
    if (filters.pickupType === "airport") {
      if (
        (filters.pickupAirportId || null) !== (getValues("pickupAirportId") || null)
      ) {
        setValue("pickupAirportId", filters.pickupAirportId || null);
      }
    }
    if (filters.pickupType === "trainStation") {
      if (
        (filters.pickupTrainId || null) !== (getValues("pickupTrainId") || null)
      ) {
        setValue("pickupTrainId", filters.pickupTrainId || null);
      }
    }

    const returnTypeFilter = filters.carReturnLocationType;
    if (
      returnTypeFilter === "branches" ||
      returnTypeFilter === "currentLocation"
    ) {
      if (
        filters.carReturnLocationId &&
        filters.carReturnLocationId !== getValues("carReturnLocationId")
      ) {
        setValue("carReturnLocationId", filters.carReturnLocationId);
      }
    }
    if (returnTypeFilter === "airport") {
      if (
        (filters.carReturnAirportId || null) !==
        (getValues("returnAirportId") || null)
      ) {
        setValue("returnAirportId", filters.carReturnAirportId || null);
      }
    }
    if (returnTypeFilter === "trainStation") {
      if (
        (filters.carReturnTrainId || null) !== (getValues("returnTrainId") || null)
      ) {
        setValue("returnTrainId", filters.carReturnTrainId || null);
      }
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
  const didBootstrapLocationTypes = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;

    // One-shot: if persisted store has no location types but session filters imply one
    // (e.g. deep-linked from bookings search), seed types once. Never continuously
    // overwrite store types from filters — that caused stale filter mode to clobber dialog state.
    if (!didBootstrapLocationTypes.current) {
      didBootstrapLocationTypes.current = true;
      const { formData: fd } = useBookedCarDetailsStore.getState();
      const mappedPickup = mapFilterLocationTypeToReservationType(
        filters.pickupType,
      );
      const mappedReturn = mapFilterLocationTypeToReservationType(
        filters.carReturnLocationType,
      );
      const patch: Partial<ReservationFormData> = {};
      if (!fd.pickupType && mappedPickup) patch.pickupType = mappedPickup;
      if (!fd.returnType && mappedReturn) patch.returnType = mappedReturn;
      if (Object.keys(patch).length > 0) {
        setFormData(patch);
      }
    }

    const syncFormToStore = (
      values: Partial<Record<keyof ReservationFormValues, unknown>>,
    ) => {
      const { formData: currentFormData, carDetails } =
        useBookedCarDetailsStore.getState();
      const patch = enrichBranchCoordinatesFromCar(
        {
          ...mapValuesToFormData(values),
          ...sessionFiltersToReturnReservationPatch(filters),
          ...sessionFiltersToPickupReservationPatch(filters),
        },
        carDetails,
        currentFormData,
      );
      setFormData(patch);
    };

    syncFormToStore(getValues());

    const subscription = watch((value) => {
      syncFormToStore(value);

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

      if (value.pickupName && !isCurrentLocationPlaceholder(value.pickupName)) {
        if (filters.pickupName !== value.pickupName) {
          setFilter("pickupName", value.pickupName);
        }
      }
      if (
        value.carReturnLocation &&
        !isCurrentLocationPlaceholder(value.carReturnLocation)
      ) {
        if (filters.carReturnLocation !== value.carReturnLocation) {
          setFilter("carReturnLocation", value.carReturnLocation);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [hasHydrated, getValues, watch, setFormData, filters, setFilter]);
};
