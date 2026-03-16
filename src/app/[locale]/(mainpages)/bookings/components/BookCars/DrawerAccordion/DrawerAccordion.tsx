"use client";
import { Input, Label, RadioGroup, RadioGroupItem } from "@/app/(components)";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/(components)/ui/accordion";
import CustomBadge from "@/app/(components)/ui/customBadge";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { getCompanyCarsCategories } from "@/services/companyCars/carCategories.service";
import { getAirports } from "@/services/pickupLocations/airports.service";
import { getTrainstations } from "@/services/pickupLocations/trainStations.service";
import { useQuery } from "@tanstack/react-query";

const DrawerAccordion = () => {
  const address = useLocationStore((state) => state.address);
  const { filters, setFilter } = useUserPreferedFiltersStore();

  const { data, isLoading } = useQuery({
    queryKey: ["company-cars-categories"],
    queryFn: () => getCompanyCarsCategories(),
  });

  const { data: airports, isLoading: airportsLoading } = useQuery({
    queryKey: ["airports"],
    queryFn: () => getAirports(),
  });

  const { data: trainStations, isLoading: trainStationsLoading } = useQuery({
    queryKey: ["train-stations"],
    queryFn: () => getTrainstations(),
  });

  const items = [
    {
      value: "price",
      trigger: "تحديد السعر:",
      content: (
        <div className="flex gap-2">
          <Input
            placeholder="من..."
            className="bg-white! text-sm!"
            type="number"
            value={filters.priceMin}
            onChange={(e) => setFilter("priceMin", e.target.value)}
          />
          <Input
            placeholder="إلى..."
            className="bg-white! text-sm!"
            type="number"
            value={filters.priceTo}
            onChange={(e) => setFilter("priceTo", e.target.value)}
          />
        </div>
      ),
    },
    {
      value: "category",
      trigger: "فئة السيارة:",
      content: (
        <RadioGroup
          className="flex flex-col gap-3 px-1"
          value={filters.categoryId}
          onValueChange={(val) => {
            const cat = data?.find((c) => c.categoryId.toString() === val);
            setFilter("categoryId", val);
            setFilter("categoryName", cat?.arabicName || "");
          }}
        >
          {data?.map((cat) => (
            <div
              dir="rtl"
              key={cat.categoryId}
              className="flex items-center gap-2"
            >
              <RadioGroupItem
                value={cat.categoryId.toString()}
                id={`cat-${cat.categoryId}`}
              />
              <Label
                htmlFor={`cat-${cat.categoryId}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {cat.arabicName}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
    {
      value: "location",
      trigger: "مكان الاستلام:",
      content: (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={filters.pickupType}
        >
          <AccordionItem value="airport" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold">
              مطار
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                dir="rtl"
                className="flex flex-col gap-3 px-1"
                value={
                  filters.pickupType === "airport"
                    ? `airport-${filters.pickupId}`
                    : ""
                }
                onValueChange={(val) => {
                  const id = val.replace("airport-", "");
                  const airport = airports?.content.find(
                    (a) => a.airportId.toString() === id,
                  );
                  setFilter("pickupType", "airport");
                  setFilter("pickupId", id);
                  setFilter("pickupName", airport?.arabicName || "");
                }}
              >
                {airports?.content.map((airport) => (
                  <div
                    key={airport.airportId}
                    className="flex items-center gap-2"
                  >
                    <RadioGroupItem
                      value={`airport-${airport.airportId}`}
                      id={`airport-${airport.airportId}`}
                    />
                    <Label
                      htmlFor={`airport-${airport.airportId}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {airport.arabicName}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="trainStation" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold">
              محطة قطار
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                dir="rtl"
                className="flex flex-col gap-3 px-1"
                value={
                  filters.pickupType === "trainStation"
                    ? `station-${filters.pickupId}`
                    : ""
                }
                onValueChange={(val) => {
                  const id = val.replace("station-", "");
                  const station = trainStations?.content.find(
                    (s) => s.stationId.toString() === id,
                  );
                  setFilter("pickupType", "trainStation");
                  setFilter("pickupId", id);
                  setFilter("pickupName", station?.arabicName || "");
                }}
              >
                {trainStations?.content.map((station) => (
                  <div
                    key={station.stationId}
                    className="flex items-center gap-2"
                  >
                    <RadioGroupItem
                      value={`station-${station.stationId}`}
                      id={`station-${station.stationId}`}
                    />
                    <Label
                      htmlFor={`station-${station.stationId}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {station.arabicName}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="currentLocation" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold">
              الموقع الحالي
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                dir="rtl"
                className="flex flex-col gap-3 px-1"
                value={filters.pickupId}
                onValueChange={(val) => {
                  setFilter("pickupType", "currentLocation");
                  setFilter("pickupId", val);
                  setFilter("pickupName", address || "الموقع الحالي");
                }}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="current-location"
                    id="current-location"
                  />
                  <Label
                    htmlFor="current-location"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {address}
                  </Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      value: "billing",
      trigger: "التصنيف:",
      content: "قريباً",
    },
    {
      value: "brand",
      trigger: "ماركة السيارة:",
      content: "قريباً",
    },
    {
      value: "model",
      trigger: "موديل السيارة:",
      content: "قريباً",
    },
  ];

  return (
    <Accordion type="multiple" className="max-w-lg" defaultValue={["price"]}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}

      <div className="w-full mt-2 flex items-center gap-2 flex-wrap">
        {[
          {
            condition: !!filters.priceMin,
            title: `من: ${filters.priceMin}`,
            onClose: () => setFilter("priceMin", ""),
          },
          {
            condition: !!filters.priceTo,
            title: `إلى: ${filters.priceTo}`,
            onClose: () => setFilter("priceTo", ""),
          },
          {
            condition: !!filters.categoryName,
            title: filters.categoryName,
            onClose: () => {
              setFilter("categoryId", "");
              setFilter("categoryName", "");
            },
          },
          {
            condition: !!filters.pickupName,
            title: filters.pickupName,
            onClose: () => {
              setFilter("pickupType", "");
              setFilter("pickupId", "");
              setFilter("pickupName", "");
            },
          },
        ]
          .filter((badge) => badge.condition)
          .map((badge, index) => (
            <CustomBadge
              toolTip={badge.title}
              key={index}
              title={
                badge.title.length > 15
                  ? badge.title.slice(0, 15) + "..."
                  : badge.title
              }
              onClose={badge.onClose}
            />
          ))}
      </div>
    </Accordion>
  );
};

export default DrawerAccordion;
