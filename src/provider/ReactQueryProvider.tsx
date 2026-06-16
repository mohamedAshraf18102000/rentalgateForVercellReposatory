"use client";

import { handleClientApiError } from "@/lib/api/client-redirect";
import { ApiError, ApiUnavailableError } from "@/lib/api/api-error";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Never retry when the backend is completely unreachable.
            // Retrying ApiUnavailableError 3× with exponential backoff delays
            // maintenance detection by 7+ seconds and fires redundant requests.
            retry: (failureCount, error) => {
              if (error instanceof ApiUnavailableError) return false;
              // Validation/client errors are deterministic and should not retry.
              if (
                error instanceof ApiError &&
                error.status !== undefined &&
                error.status >= 400 &&
                error.status < 500
              ) {
                return false;
              }
              return failureCount < 3;
            },
            retryDelay: (failureCount) =>
              Math.min(1_000 * 2 ** failureCount, 30_000),
          },
          mutations: {
            retry: (failureCount, error) => {
              if (error instanceof ApiUnavailableError) return false;
              // Avoid duplicate mutation calls on validation/business-rule failures.
              if (
                error instanceof ApiError &&
                error.status !== undefined &&
                error.status >= 400 &&
                error.status < 500
              ) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
        queryCache: new QueryCache({
          onError: handleClientApiError,
        }),
        mutationCache: new MutationCache({
          onError: handleClientApiError,
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
