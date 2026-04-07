"use client";
// import { getTrainstations } from "@/services/pickupLocations/trainStations.service";
import { TrainFront } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

const TrainLocations = () => {
  // const { data: trainStations, isLoading } = useQuery({
  //   queryKey: ["train-stations"],
  //   queryFn: () => getTrainstations(),
  // });

  const { setFilter, filters } = useUserPreferedFiltersStore();
  const { target } = usePickupDialogStore();

  const trainStations = useBookedCarDetailsStore(
    (state) => state.trainStations,
  );

  const handleValueChange = (value: string) => {
    const stationId = value.split("-")[1];
    const station = trainStations?.find(
      (s) => s.stationId.toString() === stationId,
    );
    if (station) {
      if (target === "return") {
        setFilter("carReturnLocationId", station.stationId.toString());
        setFilter("carReturnTrainId", station.stationId);
        setFilter("carReturnLocation", station.arabicName);
        setFilter("carReturnLocationType", "trainStation");
        setFilter("carReturnLocationLat", station.latitude);
        setFilter("carReturnLocationLng", station.longitude);
      } else {
        setFilter("pickupId", station.stationId.toString());
        setFilter("pickupTrainId", station.stationId);
        setFilter("pickupName", station.arabicName);
        setFilter("pickupType", "trainStation");
        setFilter("pickupLat", station.latitude);
        setFilter("pickupLng", station.longitude);
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

        {trainStations?.map((station) => (
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
                  {station.arabicName && (
                    <p className="text-xs text-muted-foreground">
                      {station.arabicName}
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
