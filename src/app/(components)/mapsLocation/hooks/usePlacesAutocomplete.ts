import { useEffect, useRef, useState } from "react";

export const usePlacesAutocomplete = (query: string, isLoaded: boolean) => {
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(
    null,
  );
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  /**
   * Lazily create (or reuse) the AutocompleteService and a fresh
   * session-token whenever the Maps library becomes available.
   */
  const getService = (): google.maps.places.AutocompleteService | null => {
    if (!isLoaded) return null;

    if (!serviceRef.current) {
      serviceRef.current = new google.maps.places.AutocompleteService();
    }

    if (!sessionTokenRef.current) {
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
    }

    return serviceRef.current;
  };

  useEffect(() => {
    if (!isLoaded || !query || query.trim().length < 2) {
      setPredictions([]);
      return;
    }

    const service = getService();
    if (!service) return;

    // Guard against stale responses arriving after a newer query fired.
    let cancelled = false;

    service.getPlacePredictions(
      {
        input: query,
        sessionToken: sessionTokenRef.current ?? undefined,
      },
      (res, status) => {
        if (cancelled) return;

        if (status === google.maps.places.PlacesServiceStatus.OK && res) {
          setPredictions(res);
        } else {
          setPredictions([]);
        }
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isLoaded]);

  /** Call this after a place is selected to reset the session token. */
  const clearPredictions = () => {
    setPredictions([]);
    // Reset the session token so the next search starts a fresh billing session.
    sessionTokenRef.current = null;
  };

  return { predictions, setPredictions: clearPredictions };
};
