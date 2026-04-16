"use client";
import { TrainFront } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { useGetTrainStations } from "@/hooks/api/useGetTrainStations";
import { Skeleton } from "../../ui/skeleton";

const HomeTrainLocations = () => {
  const { data: trainStationsData, isPending } = useGetTrainStations();

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
          dir="rtl"
          className="flex flex-col gap-y-2 w-[95%] mx-auto mt-2"
        >
          <p className="text-base font-bold">محطات القطار الأكثر شهرة:</p>

          {trainStationsData?.content?.map((station) => (
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
      )}
    </div>
  );
};

export default HomeTrainLocations;
