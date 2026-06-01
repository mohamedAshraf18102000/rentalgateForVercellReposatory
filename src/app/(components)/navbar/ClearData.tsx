"use client";

import { useRouter } from "next/navigation";
import {
  LEGACY_LOCATION_STORAGE_KEY,
  SESSION_LOCATION_STORAGE_KEY,
} from "@/lib/stores/useLocationStore";

const ClearData = () => {
  const router = useRouter();
  const handleClearData = () => {
    router.push("/");
    localStorage.removeItem("booked-car-details-storage");
    localStorage.removeItem(LEGACY_LOCATION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_LOCATION_STORAGE_KEY);
    sessionStorage.removeItem("hasClosedLocationDialog");
    sessionStorage.removeItem("user-prefered-filters-storage");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <button
      className="bg-red-900 px-3 py-1 rounded-full w-8 h-8 text-center flex items-center justify-center text-white"
      onClick={handleClearData}
    >
      C
    </button>
  );
};

export default ClearData;
