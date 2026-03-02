'use client';

import { useEffect, useRef } from 'react';
import { useSharedStore } from '@/lib/api/stores/shared.store';

/**
 * Component to fetch shared data on app initialization
 * This component runs once when the app loads
 */
export default function SharedDataLoader() {
  const fetchSharedData = useSharedStore((state) => state.fetchSharedData);
  const sharedData = useSharedStore((state) => state.sharedData);
  const isLoading = useSharedStore((state) => state.isLoading);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch if data is not already loaded and we haven't fetched yet
    if (!sharedData && !isLoading && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchSharedData();
    }
  }, [sharedData, isLoading]); // Removed fetchSharedData from dependencies to prevent infinite loop

  // This component doesn't render anything
  return null;
}

