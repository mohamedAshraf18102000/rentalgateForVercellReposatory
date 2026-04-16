"use client";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { MapPinHouse } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { useLocationStore } from "@/lib/stores/useLocationStore";

const HomeBranchesLocations = () => {
  const { carDetails, setFormData, formData } = useBookedCarDetailsStore();
  const { target, confirmDialog } = usePickupDialogStore();
  const { latitude, longitude } = useLocationStore();

  const handleValueChange = (value: string) => {
    if (carDetails) {
      if (target === "return") {
        setFormData({
          carReturnLocationId: carDetails.branchId.toString(),
          carReturnLocation: carDetails.branchName,
          returnType: "BRANCH",
          returnTrainId: null,
          returnAirportId: null,
          returnLat: latitude,
          returnLong: longitude,
        });
      } else {
        setFormData({
          pickupId: carDetails.branchId.toString(),
          pickupName: carDetails.branchName,
          pickupType: "BRANCH",
          pickupTrainId: null,
          pickupAirportId: null,
          pickupLat: latitude,
          pickupLong: longitude,
        });
      }
      confirmDialog();
    }
  };

  return (
    <div className="w-full h-full mt-4">
      <RadioGroup
        dir="rtl"
        className="flex flex-col gap-y-2 w-full"
        onValueChange={handleValueChange}
        value={
          target === "return"
            ? formData.returnType === "BRANCH"
              ? `branch-${formData.carReturnLocationId}`
              : ""
            : formData.pickupType === "BRANCH"
              ? `branch-${formData.pickupId}`
              : ""
        }
      >
        {carDetails && (
          <div className="w-[90%] mx-auto border-2 border-Grey100 p-3 rounded-xl flex items-center justify-between hover:bg-Grey100/50 transition-all cursor-pointer">
            <Label
              htmlFor={`branch-${carDetails.branchId}`}
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPinHouse className="text-primary" size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold">{carDetails.branchName}</p>
                <p className="text-xs text-muted-foreground">
                  {carDetails.branchStatus === "active"
                    ? "فرع متاح"
                    : "فرع غير متاح"}
                </p>
              </div>
            </Label>
            <RadioGroupItem
              className="border-primary border-2 h-6 w-6"
              value={`branch-${carDetails.branchId}`}
              id={`branch-${carDetails.branchId}`}
            />
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default HomeBranchesLocations;
