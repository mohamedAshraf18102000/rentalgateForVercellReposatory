"use client";

import GoogleMapsPolyLineLocation from "../../mapsLocation/GoogleMapsPolyLinedLocation";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import EmptyLocationContent from "./EmptyLocationContent/EmptyLocationContent";
import { usePickupRedirect } from "./usePickupRedirect";

const BranchesLocations = () => {
  const { carDetails } = useBookedCarDetailsStore();
  const { handleRedirectClick } = usePickupRedirect();

  if (carDetails?.branchType === 2) {
    return (
      <div className="w-full flex-1 min-h-0 flex items-center justify-center">
        <EmptyLocationContent
          content={
            <div className="flex flex-col gap-2 justify-center items-center text-center text-[15px]">
              <p className="text-StatusRed">
                الاستلام من الفرع غير متاح لهذه السيارة حالياً.
              </p>
              <p>
                جرّب اختيار الاستلام من موقعك الحالي، أو ابحث عن سيارة تدعم
                الاستلام من الفرع.
              </p>
              <p className="flex gap-0.5">
                <span>من</span>
                <span
                  className="underline font-bold underline-offset-4 cursor-pointer"
                  onClick={(event) => handleRedirectClick(event, "/")}
                >
                  الصفحة الرئيسية
                </span>
                <span className="px-0.5">أو</span>
                <span
                  className="underline font-bold underline-offset-4 cursor-pointer"
                  onClick={(event) => handleRedirectClick(event, "/bookings")}
                >
                  التصفية
                </span>
              </p>
            </div>
          }
        />
      </div>
    );
  }

  if (!carDetails?.latitude || !carDetails?.longitude) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-visible rounded-2xl">
      <GoogleMapsPolyLineLocation
        hideUserLocation
        containerHeight="100%"
        destinationLat={carDetails.latitude}
        destinationLng={carDetails.longitude}
        disableMapClickToChangeLocation
        destinationName={carDetails.branchName}
        destinationLogoUrl={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${carDetails.company.logo}`}
        autoFitBounds={true}
        hideSearch={true}
      />
    </div>
  );
};

export default BranchesLocations;
