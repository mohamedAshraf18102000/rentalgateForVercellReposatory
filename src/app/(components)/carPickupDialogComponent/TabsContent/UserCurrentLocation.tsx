import { ChevronLeft } from "lucide-react";
import GoogleMapsLocation from "../../mapsLocation/GoogleMapsLocation";
import useUserAddreses from "@/hooks/api/useUserAddreses";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { UserAddress } from "@/types/userProfile/userAddress";

const UserCurrentLocation = () => {
  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useUserAddreses();

  const { formData, setFormField } = useBookedCarDetailsStore();

  const handleSelectAddress = (address: UserAddress) => {
    setFormField("pickupName", address.addressName);
    setFormField("pickupLat", address.latitude);
    setFormField("pickupLong", address.longitude);
  };

  const handleMapLocationChange = (lat: number, lng: number, address: string) => {
    setFormField("pickupName", address);
    setFormField("pickupLat", lat);
    setFormField("pickupLong", lng);
  };

  return (
    <>
      {/* CONTENT */}
      <div className="w-full h-full">
        <GoogleMapsLocation 
          storeless 
          onLocationChange={handleMapLocationChange}
          initialLat={formData.pickupLat || undefined}
          initialLng={formData.pickupLong || undefined}
        />
      </div>

      <div className="absolute px-4 py-3 bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-primary shadow-2xl border border-Grey100 w-[94%] rounded-2xl z-20">
        <div className="flex justify-between items-center mb-3">
          <h5 className="font-bold text-base">العناوين المسجلة</h5>
          <button className="font-bold text-sm border-2 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-Grey200 transition-colors">
            عرض الكل <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {userAddresses?.map((address) => (
            <button
              title={address.address}
              key={address.addressId}
              onClick={() => handleSelectAddress(address)}
              className="bg-white border border-Grey100 p-3 rounded-xl hover:border-primary/30 transition-all cursor-pointer shadow-sm group text-start"
            >
              <p className="font-bold text-xs mb-1 group-hover:text-primary">
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
