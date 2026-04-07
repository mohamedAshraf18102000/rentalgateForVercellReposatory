"use client";
// import { getAirports } from "@/services/pickupLocations/airports.service";
import { PlaneTakeoff } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

const AirportLocations = () => {
  // const { data: airports, isLoading } = useQuery({
  //   queryKey: ["airports"],
  //   queryFn: () => getAirports(),
  // });

  const airports = useBookedCarDetailsStore((state) => state.airports);

  const { setFilter, filters } = useUserPreferedFiltersStore();
  const { target } = usePickupDialogStore();

  const handleValueChange = (value: string) => {
    const airportId = value.split("-")[1];
    const airport = airports?.find((a) => a.airportId.toString() === airportId);
    if (airport) {
      if (target === "return") {
        setFilter("carReturnLocationId", airport.airportId.toString());
        setFilter("carReturnAirportId", airport.airportId);
        setFilter("carReturnLocation", airport.arabicName);
        setFilter("carReturnLocationType", "airport");
        setFilter("carReturnLocationLat", airport.latitude);
        setFilter("carReturnLocationLng", airport.longitude);
      } else {
        setFilter("pickupId", airport.airportId.toString());
        setFilter("pickupAirportId", airport.airportId);
        setFilter("pickupName", airport.arabicName);
        setFilter("pickupType", "airport");
        setFilter("pickupLat", airport.latitude);
        setFilter("pickupLng", airport.longitude);
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
            ? filters.carReturnLocationType === "airport"
              ? `airport-${filters.carReturnLocationId}`
              : ""
            : filters.pickupType === "airport"
              ? `airport-${filters.pickupId}`
              : ""
        }
      >
        <p className="text-base font-bold">المطارات الأكثر شهرة:</p>

        {airports?.map((airport) => (
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
                  <p className="text-sm truncate">{airport.arabicName}</p>
                  {airport.arabicName && (
                    <p className="text-xs text-muted-foreground">
                      {airport.arabicName}
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
      </RadioGroup>
    </div>
  );
};

export default AirportLocations;
