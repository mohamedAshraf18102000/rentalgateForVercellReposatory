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
      className="bg-red-500 px-3 py-1 rounded-lg"
      onClick={handleClearData}
    >
      Clear Data
    </button>
  );
};

export default ClearData;
