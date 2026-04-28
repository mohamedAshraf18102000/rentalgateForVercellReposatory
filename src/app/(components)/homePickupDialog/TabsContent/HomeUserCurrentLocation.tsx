import GoogleMapsLocation from "../../mapsLocation/GoogleMapsLocation";
import useUserAddreses from "@/hooks/api/useUserAddreses";
import { UserAddress } from "@/types/userProfile/userAddress";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useAuth } from "../../navbar/hooks/useAuth";
import { useTranslations } from "next-intl";
import { ReverseGeocodeMeta } from "@/lib/utils/reverseGeocode";
import { useGetTrainStations } from "@/hooks/api/useGetTrainStations";
import { useGetAirports } from "@/hooks/api/useGetAirports";
import { detectPickupCategory } from "@/lib/utils/pickupLocationCategory";
import { ChevronLeft } from "lucide-react";
import UpdateUserSavedLocationDialog from "@/app/[locale]/(mainpages)/userProfile/components/userDialog/UpdateUserSavedLocationDialog";
import { useState } from "react";
import { useDialog } from "@/app/[locale]/(dialogs)";
import { Skeleton } from "../../ui/skeleton";

const HomeUserCurrentLocation = () => {
  const { authenticated } = useAuth();
  const t = useTranslations("home");
  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useUserAddreses(authenticated);
  const { data: trainStationsData } = useGetTrainStations();
  const { data: airportsData } = useGetAirports();
  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false);

  const { setFormField, formData } = useBookedCarDetailsStore();
  const { setFilter, filters } = useUserPreferedFiltersStore();
  const {
    target,
    closeDialog,
    setIsUnsavedMapLocation,
    setActiveTab,
    setIsCurrentLocationTabDisabled,
  } = usePickupDialogStore();
  const { openDialog } = useDialog();
  const setLocation = useLocationStore((state) => state.setLocation);

  const isAirport =
    target === "return"
      ? !!formData.returnAirportId
      : !!formData.pickupAirportId;
  const isTrain =
    target === "return" ? !!formData.returnTrainId : !!formData.pickupTrainId;
  const selectedAddressId =
    target === "return" ? formData.carReturnLocationId : filters.pickupId;

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
    setLocation(address.latitude, address.longitude, address.addressName);
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
      // Home pickup uses filter state only (same behavior as drawer filters).
      setFilter("pickupName", address.addressName);
      setFilter("pickupLat", address.latitude);
      setFilter("pickupLng", address.longitude);
      setFilter("pickupType", "currentLocation");
      setFilter("pickupId", String(address.addressId));
      setFilter("pickupAirportId", undefined);
      setFilter("pickupTrainId", undefined);
    }
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
      airports: airportsData?.content ?? [],
      trainStations: trainStationsData?.content ?? [],
    });

    if (detectedCategory === "airport") {
      setIsUnsavedMapLocation(true);
      setIsCurrentLocationTabDisabled(true);
      setActiveTab("airport");
      return;
    }

    if (detectedCategory === "trainStation") {
      setIsUnsavedMapLocation(true);
      setIsCurrentLocationTabDisabled(true);
      setActiveTab("trainStation");
      return;
    }

    setLocation(lat, lng, address);
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
      // Home pickup uses filter state only (same behavior as drawer filters).
      setFilter("pickupName", address);
      setFilter("pickupLat", lat);
      setFilter("pickupLng", lng);
      setFilter("pickupType", "currentLocation");
      setFilter("pickupId", "");
      setFilter("pickupAirportId", undefined);
      setFilter("pickupTrainId", undefined);
    }
  };

  const handleOpenLoginDialog = () => {
    closeDialog();
    openDialog("Login", {});
  };

  return (
    <>
      {/* CONTENT */}

      {authenticated ? (
        <div className="bg-white/95 backdrop-blur-md text-primary shadow-2xl border border-Grey100 rounded-2xl w-full p-2">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold text-base">
              {t("pickupDialog.savedAddressesTitle")}
            </h5>
            <button
              onClick={() => setIsAddLocationDialogOpen(true)}
              className="font-bold text-sm border-2 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-Grey200 transition-colors"
            >
              <span>اضافة عنوان جديد</span> <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {userAddresses?.length === 0 && (
            <p className="text-center text-Grey600 text-sm">
              لا توجد عناوين مسجلة
            </p>
          )}
          {isLoadingAddresses && (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-8 rounded-lg mt-3 w-[95%] mx-auto bg-gray-100"
                />
              ))}
            </>
          )}
          <div className="flex flex-col overflow-y-auto max-h-[360px] gap-3 pb-2 ">
            {userAddresses?.map((address) => (
              <button
                title={address.address}
                key={address.addressId}
                onClick={() => handleSelectAddress(address)}
                className={`bg-white border mx-2 p-3 rounded-xl transition-all cursor-pointer shadow-sm group text-start min-w-[calc(33.33%-8px)] ${
                  String(selectedAddressId) === String(address.addressId)
                    ? "border-black"
                    : "border-Grey100 hover:border-primary/30"
                }`}
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
      ) : (
        <div className="w-full h-full p-2 flex items-center justify-center absolute top-0 left-0">
          <p>
            يرجى{" "}
            <span
              onClick={handleOpenLoginDialog}
              className="font-bold underline cursor-pointer underline-offset-5"
            >
              تسجيل الدخول
            </span>{" "}
            أولًا لإمكانية الاختيار من العناوين المسجّلة.
          </p>
        </div>
      )}
      <UpdateUserSavedLocationDialog
        open={isAddLocationDialogOpen}
        setOpen={setIsAddLocationDialogOpen}
        initialShowAddForm={true}
        addFormOnlyMode={true}
        initialLat={initialLat}
        initialLng={initialLng}
        initialAddress={
          target === "return" ? formData.carReturnLocation : filters.pickupName
        }
        onSuccess={(address) => {
          handleSelectAddress(address);
          setIsAddLocationDialogOpen(false);
        }}
      />
    </>
  );
};

export default HomeUserCurrentLocation;
