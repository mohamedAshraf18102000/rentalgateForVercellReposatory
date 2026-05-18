"use client";

import GoogleMapsPolyLineLocation from "../../mapsLocation/GoogleMapsPolyLinedLocation";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import EmptyLocationContent from "./EmptyLocationContent/EmptyLocationContent";
import { usePickupRedirect } from "./usePickupRedirect";
import { normalizeImageUrl } from "@/util";
import { useTranslations } from "next-intl";

const BranchesLocations = () => {
  const t = useTranslations("home");
  const { carDetails } = useBookedCarDetailsStore();
  const { handleRedirectClick } = usePickupRedirect();

  if (carDetails?.branchType === 2) {
    return (
      <div className="w-full flex-1 min-h-0 flex items-center justify-center">
        <EmptyLocationContent
          content={
            <div className="flex flex-col gap-2 justify-center items-center text-center text-[15px]">
              <p className="text-StatusRed">
                {t("pickupDialog.emptyState.branches.unavailable")}
              </p>
              <p>{t("pickupDialog.emptyState.branches.suggestion")}</p>
              <p className="flex gap-0.5">
                <span>{t("pickupDialog.emptyState.redirectFrom")}</span>
                <span
                  className="underline font-bold underline-offset-4 cursor-pointer"
                  onClick={(event) => handleRedirectClick(event, "/")}
                >
                  {t("pickupDialog.emptyState.homePage")}
                </span>
                <span className="px-0.5">
                  {t("pickupDialog.emptyState.redirectOr")}
                </span>
                <span
                  className="underline font-bold underline-offset-4 cursor-pointer"
                  onClick={(event) => handleRedirectClick(event, "/bookings")}
                >
                  {t("pickupDialog.emptyState.filtering")}
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
        destinationLogoUrl={normalizeImageUrl(carDetails.company.logo)}
        autoFitBounds={true}
        hideSearch={true}
      />
    </div>
  );
};

export default BranchesLocations;
