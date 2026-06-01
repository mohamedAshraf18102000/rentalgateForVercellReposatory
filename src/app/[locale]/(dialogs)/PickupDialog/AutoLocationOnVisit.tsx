"use client";

import { useEffect, useRef } from "react";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import {
  getBrowserPosition,
  hasLocationMoved,
  waitForLocationStoreHydration,
} from "@/lib/utils/geolocation";
import { findNearestSavedAddress } from "@/lib/utils/matchSavedAddress";
import { reverseGeocodeWithDetails } from "@/lib/utils/reverseGeocode";
import { getUserAddress } from "@/services/userProfile/getUserAddress.service";
import { getAuthToken } from "@/util/auth";

/**
 * On each new browser session, detects the user's current position and sets it
 * as the active location immediately. Skipped when the user manually picked a
 * location earlier in the same session.
 */
export function AutoLocationOnVisit() {
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (hasSyncedRef.current) {
      return;
    }

    let isCancelled = false;

    const syncAutoLocation = async () => {
      await waitForLocationStoreHydration();

      if (isCancelled || hasSyncedRef.current) {
        return;
      }

      hasSyncedRef.current = true;

      const {
        isSessionManualLocation,
        userPhysical_Latitude,
        userPhysical_Longitude,
        setUserPhysical_Location,
      } = useLocationStore.getState();

      if (isSessionManualLocation) {
        return;
      }

      const { setIsDetectingUserLocation } = useLocationStore.getState();
      setIsDetectingUserLocation(true);

      try {
        const coords = await getBrowserPosition();
        if (isCancelled) {
          return;
        }

        const lat = coords.latitude;
        const lng = coords.longitude;
        const hasSessionLocation =
          userPhysical_Latitude != null && userPhysical_Longitude != null;

        if (
          hasSessionLocation &&
          !hasLocationMoved(
            userPhysical_Latitude,
            userPhysical_Longitude,
            lat,
            lng,
          )
        ) {
          return;
        }

        let resolvedLat = lat;
        let resolvedLng = lng;
        let resolvedAddress: string | null = null;
        let resolvedAddressId: number | null = null;

        if (getAuthToken()) {
          try {
            const userAddresses = await getUserAddress();
            if (isCancelled) {
              return;
            }

            const matchedSaved = findNearestSavedAddress(
              lat,
              lng,
              userAddresses ?? [],
            );

            if (matchedSaved) {
              resolvedLat = matchedSaved.latitude;
              resolvedLng = matchedSaved.longitude;
              resolvedAddress = matchedSaved.addressName;
              resolvedAddressId = matchedSaved.addressId;
            }
          } catch {
            // Fall through to reverse geocode.
          }
        }

        if (!resolvedAddress) {
          const details = await reverseGeocodeWithDetails(lat, lng);
          if (isCancelled) {
            return;
          }
          resolvedAddress = details?.address ?? null;
        }

        setUserPhysical_Location(
          resolvedLat,
          resolvedLng,
          resolvedAddress,
          resolvedAddressId,
          { isSessionManual: false },
        );
      } catch {
        // Fall back to the last location in this session (sessionStorage), if any.
      } finally {
        useLocationStore.getState().setIsDetectingUserLocation(false);
      }
    };

    void syncAutoLocation();

    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
}
