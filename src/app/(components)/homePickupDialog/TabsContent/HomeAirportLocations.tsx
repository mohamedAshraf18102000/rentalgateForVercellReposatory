"use client";
// import { getAirports } from "@/services/pickupLocations/airports.service";
import { PlaneTakeoff } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { useGetAirports } from "@/hooks/api/useGetAirports";
import { Skeleton } from "../../ui/skeleton";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

const HomeAirportLocations = () => {
  const { data: airportsData, isPending } = useGetAirports();
  const { setFilter, filters } = useUserPreferedFiltersStore();

  const handleAirportSelection = (value: string) => {
    const id = value.replace("airport-", "");
    const selectedAirport = airportsData?.content?.find(
      (airport) => airport.airportId.toString() === id,
    );

    setFilter("pickupType", "airport");
    setFilter("pickupId", id);
    setFilter("pickupAirportId", Number(id));
    setFilter("pickupTrainId", undefined);
    setFilter("pickupName", selectedAirport?.arabicName || "");
    setFilter("pickupLat", undefined);
    setFilter("pickupLng", undefined);
  };

  return (
    <div className="w-full h-full">
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
          onValueChange={handleAirportSelection}
          value={
            filters.pickupType === "airport" && filters.pickupAirportId != null
              ? `airport-${filters.pickupAirportId}`
              : ""
          }
        >
          <p className="text-base font-bold">المطارات الأكثر شهرة:</p>

          <div className="overflow-y-auto max-h-[360px]">
            {airportsData?.content?.map((airport) => (
              <div key={airport.airportId}>
                <div className="flex items-center gap-4 p-2 rounded-lg mx-auto hover:bg-Grey100">
                  <Label
                    htmlFor={`airport-${airport.airportId}`}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <PlaneTakeoff
                      className="text-primary transition-colors"
                      size={20}
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm truncate">{airport.name}</p>
                      {airport.name && (
                        <p className="text-xs text-muted-foreground">
                          {airport.name}
                        </p>
                      )}
                    </div>
                  </Label>
                  <RadioGroupItem
                    className="border-primary border-2 h-6 w-6"
                    value={`airport-${airport.airportId}`}
                    id={`airport-${airport.airportId}`}
                  />
                </div>
                <Separator className="my-1" />
              </div>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  );
};

export default HomeAirportLocations;
