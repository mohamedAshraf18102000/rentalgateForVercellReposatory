import GoogleMapsLocation from "../../mapsLocation/GoogleMapsLocation";
import useUserAddreses from "@/hooks/api/useUserAddreses";
import { UserAddress } from "@/types/userProfile/userAddress";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useTranslations } from "next-intl";
import { ReverseGeocodeMeta } from "@/lib/utils/reverseGeocode";
import { detectPickupCategory } from "@/lib/utils/pickupLocationCategory";
import { Loader2 } from "lucide-react";

const UserCurrentLocation = () => {
  const t = useTranslations("home");
  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useUserAddreses();

  const { setFormField, formData, airports, trainStations } =
    useBookedCarDetailsStore();
  const {
    target,
    setIsUnsavedMapLocation,
    confirmDialog,
    setActiveTab,
    setIsCurrentLocationTabDisabled,
  } = usePickupDialogStore();
  const isAirport =
    target === "return"
      ? !!formData.returnAirportId
      : !!formData.pickupAirportId;
  const isTrain =
    target === "return" ? !!formData.returnTrainId : !!formData.pickupTrainId;

  // If the stored location is an airport or train station, we ignore it and use undefined
  // to let GoogleMapsLocation default to the user's real location.
  // We use formData from useBookedCarDetailsStore for initial coordinates.
  const initialLat =
    isAirport || isTrain
      ? undefined
      : target === "return"
        ? formData.returnLat || undefined
        : formData.pickupLat || undefined;
  const initialLng =
    isAirport || isTrain
      ? undefined
      : target === "return"
        ? formData.returnLong || undefined
        : formData.pickupLong || undefined;

  const handleSelectAddress = (address: UserAddress) => {
    setIsUnsavedMapLocation(false);
    setIsCurrentLocationTabDisabled(false);
    if (target === "return") {
      // Update BookedCarDetailsStore only
      setFormField("carReturnLocation", address.addressName);
      setFormField("returnLat", address.latitude);
      setFormField("returnLong", address.longitude);
      setFormField("returnType", "MY_LOCATION");
      setFormField("carReturnLocationId", String(address.addressId));
      setFormField("returnAirportId", null);
      setFormField("returnTrainId", null);
    } else {
      // Update BookedCarDetailsStore only
      setFormField("pickupName", address.addressName);
      setFormField("pickupLat", address.latitude);
      setFormField("pickupLong", address.longitude);
      setFormField("pickupType", "MY_LOCATION");
      setFormField("pickupId", String(address.addressId));
      setFormField("pickupAirportId", null);
      setFormField("pickupTrainId", null);
    }
    confirmDialog();
  };

  const handleMapLocationChange = (
    lat: number,
    lng: number,
    address: string,
    isManual?: boolean,
    geocodeMeta?: ReverseGeocodeMeta,
  ) => {
    const detectedCategory = detectPickupCategory({
      lat,
      lng,
      address,
      geocodeMeta,
      airports: airports ?? [],
      trainStations: trainStations ?? [],
    });

    if (detectedCategory === "airport" || detectedCategory === "trainStation") {
      setIsUnsavedMapLocation(true);
      setIsCurrentLocationTabDisabled(true);
      setActiveTab(detectedCategory);
      return;
    }

    if (isManual === false) return;
    setIsUnsavedMapLocation(true);
    setIsCurrentLocationTabDisabled(false);
    if (target === "return") {
      // Update BookedCarDetailsStore
      setFormField("carReturnLocation", address);
      setFormField("returnLat", lat);
      setFormField("returnLong", lng);
      setFormField("returnType", "MY_LOCATION");
      setFormField("carReturnLocationId", null);
      setFormField("returnAirportId", null);
      setFormField("returnTrainId", null);
    } else {
      // Update BookedCarDetailsStore
      setFormField("pickupName", address);
      setFormField("pickupLat", lat);
      setFormField("pickupLong", lng);
      setFormField("pickupType", "MY_LOCATION");
      setFormField("pickupId", null);
      setFormField("pickupAirportId", null);
      setFormField("pickupTrainId", null);
    }
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-md text-primary rounded-2xl w-full h-full p-2 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h5 className="font-bold text-base">
            {t("pickupDialog.savedAddressesTitle")}
          </h5>
        </div>
        {userAddresses?.length === 0 && (
          <p className="text-center text-Grey600 text-sm">
            {t("pickupDialog.noSavedAddresses")}
          </p>
        )}
        <div className="flex-1 min-h-0 max-h-[400px] overflow-y-auto flex flex-col gap-3 overscroll-contain pr-1 pb-5">
          {userAddresses?.map((address) => (
            <button
              title={address.address}
              key={address.addressId}
              onClick={() => handleSelectAddress(address)}
              className="bg-white border border-Grey100 p-3 rounded-xl hover:border-primary/30 transition-all mx-2 cursor-pointer shadow-sm group text-start"
            >
              <p className="font-bold text-xs group-hover:text-primary ">
                {address.addressName}
              </p>
              <p className="line-clamp-1 text-Grey600 text-[10px] leading-tight">
                {address.address}
              </p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserCurrentLocation;
