"use client";
import { TrainFront } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { useGetTrainStations } from "@/hooks/api/useGetTrainStations";
import { Skeleton } from "../../ui/skeleton";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useLocale, useTranslations } from "next-intl";

const HomeTrainLocations = () => {
  const { data: trainStationsData, isPending } = useGetTrainStations();
  const { setFormData, formData } = useBookedCarDetailsStore();
  const t = useTranslations("home");
  const locale = useLocale();
  const handleStationSelection = (value: string) => {
    const id = value.replace("station-", "");
    const selectedStation = trainStationsData?.content?.find(
      (station) => station.stationId.toString() === id,
    );
    const selectedStationName = selectedStation
      ? locale === "ar"
        ? selectedStation.arabicName
        : selectedStation.englishName
      : "";

    setFormData({
      pickupType: "TRAIN_STATION",
      pickupTrainId: Number(id),
      pickupAirportId: null,
      pickupId: null,
      pickupName: selectedStationName,
      pickupLat: null,
      pickupLong: null,
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {isPending ? (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-8 rounded-lg mt-3 w-[95%] mx-auto"
            />
          ))}
        </>
      ) : (
        <RadioGroup
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="flex flex-col gap-y-2 w-[95%] mx-auto mt-2"
          onValueChange={handleStationSelection}
          value={
            formData.pickupType === "TRAIN_STATION" &&
            formData.pickupTrainId != null
              ? `station-${formData.pickupTrainId}`
              : ""
          }
        >
          <p className="text-base font-bold">
            {t("pickupDialog.popularLocations.trainStations")}
          </p>

          {trainStationsData?.content?.map((station) => (
            <div
              key={station.stationId}
              className="overflow-y-auto max-h-[360px]"
            >
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
                    <p className="text-sm truncate">
                      {locale === "ar"
                        ? station.arabicName
                        : station.englishName}
                    </p>
                    {station && (
                      <p className="text-xs text-muted-foreground">
                        {locale === "ar"
                          ? station.arabicName
                          : station.englishName}
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
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default HomeTrainLocations;
