"use client";
// import { getTrainstations } from "@/services/pickupLocations/trainStations.service";
import { TrainFront } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useLocale, useTranslations } from "next-intl";

const TrainLocations = () => {
  const { trainStations, setFormData, formData } = useBookedCarDetailsStore();
  const { target, confirmDialog } = usePickupDialogStore();
  const t = useTranslations("home");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const handleValueChange = (value: string) => {
    const stationId = value.split("-")[1];
    const station = trainStations?.find(
      (s) => s.stationId.toString() === stationId,
    );
    if (station) {
      const selectedStationName =
        locale === "ar" ? station.arabicName : station.englishName;
      if (target === "return") {
        setFormData({
          returnTrainId: station.stationId as number,
          carReturnLocation: selectedStationName,
          returnType: "TRAIN_STATION",
          returnAirportId: null,
          carReturnLocationId: null,
          returnLat: null,
          returnLong: null,
        });
      } else {
        setFormData({
          pickupTrainId: station.stationId as number,
          pickupName: selectedStationName,
          pickupType: "TRAIN_STATION",
          pickupAirportId: null,
          pickupId: null,
          pickupLat: null,
          pickupLong: null,
        });
      }
      confirmDialog();
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <RadioGroup
        dir={dir}
        className="flex flex-col gap-y-2 w-[95%] mx-auto mt-2"
        onValueChange={handleValueChange}
        value={
          target === "return"
            ? formData.returnType === "TRAIN_STATION"
              ? `station-${formData.returnTrainId}`
              : ""
            : formData.pickupType === "TRAIN_STATION"
              ? `station-${formData.pickupTrainId}`
              : ""
        }
      >
        <p className="text-base font-bold">
          {t("pickupDialog.popularLocations.trainStations")}
        </p>

        {trainStations?.map((station) => {
          return (
            <div key={station.stationId}>
              <div className="flex items-center gap-4 p-2 rounded-lg mx-auto hover:bg-Grey100">
                <Label
                  htmlFor={`station-${station.stationId}`}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <TrainFront
                    className="text-primary transition-colors"
                    size={20}
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm truncate">{station.name}</p>
                    {station.name && (
                      <p className="text-xs text-muted-foreground">
                        {station.name}
                      </p>
                    )}
                  </div>
                </Label>
                <RadioGroupItem
                  className="border-primary border-2 h-6 w-6"
                  value={`station-${station.stationId}`}
                  id={`station-${station.stationId}`}
                />
              </div>
              <Separator className="my-1" />
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default TrainLocations;
