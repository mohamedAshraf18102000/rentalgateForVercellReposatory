"use client";

import { useRouter } from "next/navigation";

const ClearData = () => {
  const router = useRouter();
  const handleClearData = () => {
    router.push("/");
    localStorage.removeItem("booked-car-details-storage");
    localStorage.removeItem("user-location-storage");
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
