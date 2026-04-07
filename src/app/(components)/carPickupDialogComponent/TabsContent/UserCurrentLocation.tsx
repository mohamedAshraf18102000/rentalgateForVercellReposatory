import { ChevronLeft } from "lucide-react";
import GoogleMapsLocation from "../../mapsLocation/GoogleMapsLocation";
import useUserAddreses from "@/hooks/api/useUserAddreses";
import { UserAddress } from "@/types/userProfile/userAddress";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

const UserCurrentLocation = () => {
  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useUserAddreses();

  const { filters, setFilter } = useUserPreferedFiltersStore();
  const { setFormField, formData } = useBookedCarDetailsStore();
  const { target, setIsUnsavedMapLocation, confirmDialog } =
    usePickupDialogStore();

  const isAirport =
    target === "return"
      ? !!formData.returnAirportId
      : !!formData.pickupAirportId;
  const isTrain =
    target === "return" ? !!formData.returnTrainId : !!formData.pickupTrainId;

  // If the stored location is an airport or train station, we ignore it and use undefined
  // to let GoogleMapsLocation default to the user's real location.
  const initialLat = (isAirport || isTrain)
    ? undefined
    : (target === "return" ? filters.carReturnLocationLat : filters.pickupLat);
  const initialLng = (isAirport || isTrain)
    ? undefined
    : (target === "return" ? filters.carReturnLocationLng : filters.pickupLng);

  const handleSelectAddress = (address: UserAddress) => {
    setIsUnsavedMapLocation(false);
    if (target === "return") {
      setFilter("carReturnLocation", address.addressName);
      setFilter("carReturnLocationLat", address.latitude);
      setFilter("carReturnLocationLng", address.longitude);
      setFilter("carReturnLocationType", "currentLocation");
      setFilter("carReturnLocationId", String(address.addressId));

      // Update BookedCarDetailsStore
      setFormField("carReturnLocation", address.addressName);
      setFormField("returnLat", address.latitude);
      setFormField("returnLong", address.longitude);
      setFormField("returnType", "MY_LOCATION");
      setFormField("carReturnLocationId", String(address.addressId));
      setFormField("returnAirportId", null);
      setFormField("returnTrainId", null);

      // Clear other location IDs in preference store
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnTrainId", undefined);
    } else {
      setFilter("pickupName", address.addressName);
      setFilter("pickupLat", address.latitude);
      setFilter("pickupLng", address.longitude);
      setFilter("pickupType", "currentLocation");
      setFilter("pickupId", String(address.addressId));

      // Update BookedCarDetailsStore
      setFormField("pickupName", address.addressName);
      setFormField("pickupLat", address.latitude);
      setFormField("pickupLong", address.longitude);
      setFormField("pickupType", "MY_LOCATION");
      setFormField("pickupId", String(address.addressId));
      setFormField("pickupAirportId", null);
      setFormField("pickupTrainId", null);

      // Clear other location IDs in preference store
      setFilter("pickupAirportId", undefined);
      setFilter("pickupTrainId", undefined);
    }
    confirmDialog();
  };

  const handleMapLocationChange = (
    lat: number,
    lng: number,
    address: string,
    isManual?: boolean,
  ) => {
    if (isManual === false) return;
    setIsUnsavedMapLocation(true);
    if (target === "return") {
      setFilter("carReturnLocation", address);
      setFilter("carReturnLocationLat", lat);
      setFilter("carReturnLocationLng", lng);
      setFilter("carReturnLocationType", "currentLocation");

      // Update BookedCarDetailsStore
      setFormField("carReturnLocation", address);
      setFormField("returnLat", lat);
      setFormField("returnLong", lng);
      setFormField("returnType", "MY_LOCATION");
      setFormField("carReturnLocationId", null);
      setFormField("returnAirportId", null);
      setFormField("returnTrainId", null);

      // Clear other location IDs in preference store
      setFilter("carReturnAirportId", undefined);
      setFilter("carReturnTrainId", undefined);
      setFilter("carReturnLocationId", undefined);
    } else {
      setFilter("pickupName", address);
      setFilter("pickupLat", lat);
      setFilter("pickupLng", lng);
      setFilter("pickupType", "currentLocation");

      // Update BookedCarDetailsStore
      setFormField("pickupName", address);
      setFormField("pickupLat", lat);
      setFormField("pickupLong", lng);
      setFormField("pickupType", "MY_LOCATION");
      setFormField("pickupId", "current-location");
      setFormField("pickupAirportId", null);
      setFormField("pickupTrainId", null);

      // Clear other location IDs in preference store
      setFilter("pickupAirportId", undefined);
      setFilter("pickupTrainId", undefined);
      setFilter("pickupId", "current-location");
    }
  };

  return (
    <>
      {/* CONTENT */}
      <div className="w-full h-full">
        <GoogleMapsLocation
          storeless
          onLocationChange={handleMapLocationChange}
          initialLat={initialLat}
          initialLng={initialLng}
        />
      </div>

      <div className="absolute px-4 py-3 bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-primary shadow-2xl border border-Grey100 w-[94%] rounded-2xl z-20">
        <div className="flex justify-between items-center mb-3">
          <h5 className="font-bold text-base">العناوين المسجلة</h5>
          {/* <button className="font-bold text-sm border-2 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-Grey200 transition-colors">
            عرض الكل <ChevronLeft className="w-4 h-4" />
          </button> */}
        </div>

        {userAddresses?.length === 0 && (
          <p className="text-center text-Grey600 text-sm">
            لا توجد عناوين مسجلة
          </p>
        )}
        <div className="flex overflow-x-auto gap-3 pb-2 ">
          {userAddresses?.map((address) => (
            <button
              title={address.address}
              key={address.addressId}
              onClick={() => handleSelectAddress(address)}
              className="bg-white border border-Grey100 p-3 rounded-xl hover:border-primary/30 transition-all cursor-pointer shadow-sm group text-start min-w-[calc(33.33%-8px)]"
            >
              <p className="font-bold text-xs mb-1 group-hover:text-primary leading-tight line-clamp-1">
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
