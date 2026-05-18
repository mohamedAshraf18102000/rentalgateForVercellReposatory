"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

export function useDeleteAccountWarningItems() {
  const t = useTranslations("profile.deleteAccountDialog.warnings");

  return useMemo(
    () => [
      {
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 mt-0.5 shrink-0 text-amber-500"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
            />
          </svg>
        ),
        text: t("reactivate"),
      },
      {
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 mt-0.5 shrink-0 text-blue-500"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5z"
            />
          </svg>
        ),
        text: t("subscriptions"),
      },
      {
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 mt-0.5 shrink-0 text-slate-400"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
            />
          </svg>
        ),
        text: t("searchEngines"),
      },
      {
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        ),
        text: t("editProfile"),
      },
      {
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 mt-0.5 shrink-0 text-violet-500"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        ),
        text: t("changeEmail"),
      },
      {
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 mt-0.5 shrink-0 text-rose-500"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        ),
        text: t("downloadData"),
      },
    ],
    [t],
  );
}
