"use client";
import { getTrainstations } from "@/services/pickupLocations/trainStations.service";
import { useQuery } from "@tanstack/react-query";
import { TrainFront } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

const TrainLocations = () => {
  const { data: trainStations, isLoading } = useQuery({
    queryKey: ["train-stations"],
    queryFn: () => getTrainstations(),
  });

  const { setFilter, filters } = useUserPreferedFiltersStore();
  const { target } = usePickupDialogStore();

  const handleValueChange = (value: string) => {
    const stationId = value.split("-")[1];
    const station = trainStations?.content.find(
      (s) => s.stationId.toString() === stationId
    );
    if (station) {
      if (target === "return") {
        setFilter("carReturnLocationId", station.stationId.toString());
        setFilter("carReturnLocation", station.arabicName);
        setFilter("carReturnLocationType", "trainStation");
      } else {
        setFilter("pickupId", station.stationId.toString());
        setFilter("pickupName", station.arabicName);
        setFilter("pickupType", "trainStation");
      }
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <RadioGroup
        dir="rtl"
        className="flex flex-col gap-y-2 w-[95%] mx-auto mt-2"
        onValueChange={handleValueChange}
        value={
          target === "return"
            ? filters.carReturnLocationType === "trainStation"
              ? `station-${filters.carReturnLocationId}`
              : ""
            : filters.pickupType === "trainStation"
            ? `station-${filters.pickupId}`
            : ""
        }
      >
        <p className="text-base font-bold">محطات القطار الأكثر شهرة:</p>

        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            جاري التحميل...
          </p>
        )}

        {!isLoading && trainStations?.content.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            لا توجد محطات قطار متاحة
          </p>
        )}

        {trainStations?.content.map((station) => (
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
                  <p className="text-sm truncate">{station.arabicName}</p>
                  {station.cityArabicName && (
                    <p className="text-xs text-muted-foreground">
                      {station.cityArabicName}
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
    </div>
  );
};

export default TrainLocations;
