"use client";

import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export const usePickupRedirect = () => {
  const router = useRouter();
  const { closeDialog } = usePickupDialogStore();

  const handleRedirectClick = (
    event: MouseEvent<HTMLElement>,
    path: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    closeDialog();
    sessionStorage.setItem("hasClosedLocationDialog", "true");
    router.push(path);
  };

  return { handleRedirectClick };
};
