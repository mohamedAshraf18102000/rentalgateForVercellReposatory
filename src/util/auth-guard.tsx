"use client";

import * as React from "react";
import { isAuthenticated, isTokenValid, getUserData } from "./auth";

/**
 * AuthGuard Component
 * Shows children only if authentication condition is met
 */

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Show only if authenticated
  requireGuest?: boolean; // Show only if NOT authenticated
  requireRole?: string; // Show only if user has specific role
  requireProperty?: { name: string; value?: any }; // Show only if user has property
  fallback?: React.ReactNode; // Component to show if condition is not met
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  requireGuest = false,
  requireRole,
  requireProperty,
  fallback = null,
}) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  const authenticated = isAuthenticated() && isTokenValid();
  const userData = getUserData();

  // Check authentication requirement
  if (requireAuth && !authenticated) {
    return <>{fallback}</>;
  }

  // Check guest requirement
  if (requireGuest && authenticated) {
    return <>{fallback}</>;
  }

  // Check role requirement
  if (requireRole && (!authenticated || !userData)) {
    return <>{fallback}</>;
  }

  if (requireRole && userData) {
    const hasRole =
      userData.role === requireRole ||
      userData.permissions?.includes(requireRole);
    if (!hasRole) {
      return <>{fallback}</>;
    }
  }

  // Check property requirement
  if (requireProperty && (!authenticated || !userData)) {
    return <>{fallback}</>;
  }

  if (requireProperty && userData) {
    const hasProperty =
      requireProperty.value !== undefined
        ? userData[requireProperty.name] === requireProperty.value
        : userData[requireProperty.name] !== undefined &&
          userData[requireProperty.name] !== null;

    if (!hasProperty) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

