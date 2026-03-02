// ============================================================================
// Hooks
// ============================================================================

import * as React from 'react';
import { isAuthenticated, isTokenValid } from '@/util/auth';
import { useClientStore } from '@/lib/api/stores';
import { AUTH_CHECK_INTERVAL } from '../constants';

/**
 * Custom hook to manage authentication state
 */
export function useAuth() {
  const [isClient, setIsClient] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const { clientData, isLoading: isDataLoading, fetchClientData, clearClientData } = useClientStore();
  const hasFetchedRef = React.useRef(false);
  const lastAuthStateRef = React.useRef<boolean | null>(null);

  // Initialize client-side state
  React.useEffect(() => {
    setIsClient(true);
    const auth = isAuthenticated() && isTokenValid();
    setAuthenticated(auth);
    lastAuthStateRef.current = auth;
    
    // Fetch client data if authenticated and not already fetched
    if (auth && !clientData && !isDataLoading && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchClientData();
    } else if (!auth) {
      hasFetchedRef.current = false;
      clearClientData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for authentication changes
  React.useEffect(() => {
    if (!isClient) return;

    const checkAuth = () => {
      const auth = isAuthenticated() && isTokenValid();
      
      // Get current state from store directly to avoid stale closures
      const currentClientData = useClientStore.getState().clientData;
      const currentIsLoading = useClientStore.getState().isLoading;
      
      // Only update if auth state changed
      if (auth !== lastAuthStateRef.current) {
        lastAuthStateRef.current = auth;
        setAuthenticated(auth);
        
        if (auth) {
          // Fetch client data if not already loaded and not currently loading
          if (!currentClientData && !currentIsLoading && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            useClientStore.getState().fetchClientData();
          }
        } else {
          hasFetchedRef.current = false;
          useClientStore.getState().clearClientData();
        }
      } else if (auth && !currentClientData && !currentIsLoading && !hasFetchedRef.current) {
        // If auth is true but data is missing, fetch it
        hasFetchedRef.current = true;
        useClientStore.getState().fetchClientData();
      }
    };

    const interval = setInterval(checkAuth, AUTH_CHECK_INTERVAL);
    window.addEventListener('storage', checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, [isClient]); // Only depend on isClient to prevent infinite loop

  return { 
    isClient, 
    authenticated, 
    userData: clientData, // Return clientData as userData for backward compatibility
    isLoading: authenticated && (isDataLoading || !clientData) // Loading when authenticated but data not yet loaded
  };
}

