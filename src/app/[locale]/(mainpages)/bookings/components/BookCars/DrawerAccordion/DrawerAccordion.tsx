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
import { getCarBrands } from "@/services/companyCars/carBrands.service";
import { getCompanyCarsCategories } from "@/services/companyCars/carCategories.service";
import { getCarModelByBrands } from "@/services/companyCars/carModelByBrands.service";
import { getAirports } from "@/services/pickupLocations/airports.service";
import { getTrainstations } from "@/services/pickupLocations/trainStations.service";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

const DrawerAccordion = () => {
  const locale = useLocale();
  const t = useTranslations("home");
  const isArabic = locale === "ar";
  const contentDirection = isArabic ? "rtl" : "ltr";

  const address = useLocationStore((state) => state.address);
  const { filters, setFilter } = useUserPreferedFiltersStore();

  const { data, isLoading } = useQuery({
    queryKey: ["company-cars-categories"],
    queryFn: () => getCompanyCarsCategories(),
  });
  const selectedCategoryName =
    filters.categoryName ||
    data?.find((cat) => cat.categoryId.toString() === filters.categoryId)
      ?.arabicName ||
    "";

  const { data: airports, isLoading: airportsLoading } = useQuery({
    queryKey: ["airports"],
    queryFn: () => getAirports(),
  });

  const { data: trainStations, isLoading: trainStationsLoading } = useQuery({
    queryKey: ["train-stations"],
    queryFn: () => getTrainstations(),
  });

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getCarBrands(),
  });

  const { data: carModels, isLoading: carModelsLoading } = useQuery({
    queryKey: ["car-models", filters.brandId],
    queryFn: () => getCarModelByBrands(Number(filters.brandId)),
    enabled: !!filters.brandId,
  });

  const items = [
    {
      value: "price",
      trigger: t("bookings.drawerAccordion.triggers.price"),
      content: (
        <div className="flex gap-2">
          <Input
            placeholder={t("bookings.drawerAccordion.price.minPlaceholder")}
            className="bg-white! text-sm!"
            type="number"
            value={filters.priceMin}
            onChange={(e) => setFilter("priceMin", e.target.value)}
          />
          <Input
            placeholder={t("bookings.drawerAccordion.price.maxPlaceholder")}
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
      trigger: t("bookings.drawerAccordion.triggers.category"),
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
              dir={contentDirection}
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
                {locale === "ar" ? cat.arabicName : cat.englishName}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
    {
      value: "location",
      trigger: t("bookings.drawerAccordion.triggers.location"),
      content: (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={filters.pickupType}
        >
          <AccordionItem value="airport" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm">
              {t("bookings.drawerAccordion.pickupTypes.airport")}
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                dir={contentDirection}
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
                  setFilter(
                    "pickupName",
                    locale === "ar"
                      ? airport?.arabicName || ""
                      : airport?.englishName || "",
                  );
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
                      {locale === "ar"
                        ? airport.arabicName
                        : airport.englishName}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="trainStation" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm">
              {t("bookings.drawerAccordion.pickupTypes.trainStation")}
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                dir={contentDirection}
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
                  setFilter(
                    "pickupName",
                    locale === "ar"
                      ? station?.arabicName || ""
                      : station?.englishName || "",
                  );
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
                      {locale === "ar"
                        ? station.arabicName
                        : station.englishName}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="currentLocation" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm">
              {t("bookings.drawerAccordion.pickupTypes.currentLocation")}
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                dir="rtl"
                className="flex flex-col gap-3 px-1"
                value={
                  filters.pickupType === "currentLocation"
                    ? "current-location"
                    : ""
                }
                onValueChange={(val) => {
                  setFilter("pickupType", "currentLocation");
                  setFilter("pickupId", val);
                  setFilter(
                    "pickupName",
                    address ||
                      t("bookings.drawerAccordion.pickupTypes.currentLocation"),
                  );
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
                    {address ||
                      t("bookings.drawerAccordion.pickupTypes.currentLocation")}
                  </Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      value: "brand",
      trigger: t("bookings.drawerAccordion.triggers.brand"),
      content: (
        <RadioGroup
          className="flex flex-col gap-3 px-1"
          value={filters.brandId}
          onValueChange={(val) => {
            const brand = brands?.content.find(
              (b) => b.brandId.toString() === val,
            );
            setFilter("brandId", val);
            setFilter(
              "brandName",
              locale === "ar"
                ? brand?.arabicName || ""
                : brand?.englishName || "",
            );
            setFilter("modelId", "");
            setFilter("modelName", "");
          }}
        >
          {brands?.content.map((brand) => (
            <div
              dir={contentDirection}
              key={brand.brandId}
              className="flex items-center gap-2"
            >
              <RadioGroupItem
                value={brand.brandId.toString()}
                id={`brand-${brand.brandId}`}
              />
              <Label
                htmlFor={`brand-${brand.brandId}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${brand.icon}`}
                  alt={brand.englishName}
                  width={25}
                  height={25}
                  className="object-cover rounded-full"
                />
                {locale === "ar" ? brand.arabicName : brand.englishName}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
    {
      value: "model",
      trigger: t("bookings.drawerAccordion.triggers.model"),
      content: !filters.brandId ? (
        <p className="text-sm text-muted-foreground">
          {t("bookings.drawerAccordion.model.selectBrandFirst")}
        </p>
      ) : carModelsLoading ? (
        <p className="text-sm text-muted-foreground">
          {t("bookings.drawerAccordion.model.loading")}
        </p>
      ) : (
        <RadioGroup
          className="flex flex-col gap-3 px-1"
          value={filters.modelId}
          onValueChange={(val) => {
            const model = carModels?.find((m) => m.typeId.toString() === val);
            setFilter("modelId", val);
            setFilter(
              "modelName",
              locale === "ar"
                ? model?.arabicName || ""
                : model?.englishName || "",
            );
          }}
        >
          {carModels?.map((model) => (
            <div
              dir={contentDirection}
              key={model.typeId}
              className="flex items-center gap-2"
            >
              <RadioGroupItem
                value={model.typeId.toString()}
                id={`model-${model.typeId}`}
              />
              <Label
                htmlFor={`model-${model.typeId}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {locale === "ar" ? model.arabicName : model.englishName}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
  ];

  return (
    <Accordion type="multiple" className="max-w-lg" defaultValue={["price"]}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger className="my-5">{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}

      <div className="w-full mt-2 flex items-center gap-2 flex-wrap">
        {[
          {
            condition: !!filters.priceMin,
            title: `${t("bookings.drawerAccordion.badges.from")}: ${filters.priceMin}`,
            onClose: () => setFilter("priceMin", ""),
          },
          {
            condition: !!filters.priceTo,
            title: `${t("bookings.drawerAccordion.badges.to")}: ${filters.priceTo}`,
            onClose: () => setFilter("priceTo", ""),
          },
          {
            condition: !!filters.categoryId,
            title: selectedCategoryName,
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
          {
            condition: !!filters.brandName,
            title: filters.brandName,
            onClose: () => {
              setFilter("brandId", "");
              setFilter("brandName", "");
              setFilter("modelId", "");
              setFilter("modelName", "");
            },
          },
          {
            condition: !!filters.modelName,
            title: filters.modelName,
            onClose: () => {
              setFilter("modelId", "");
              setFilter("modelName", "");
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
