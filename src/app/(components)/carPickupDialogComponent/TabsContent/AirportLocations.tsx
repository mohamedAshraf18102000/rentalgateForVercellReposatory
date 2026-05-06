"use client";
// import { getAirports } from "@/services/pickupLocations/airports.service";
import { Info, PlaneTakeoff } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useLocale, useTranslations } from "next-intl";
import EmptyLocationContent from "./EmptyLocationContent/EmptyLocationContent";
import { usePickupRedirect } from "./usePickupRedirect";

const AirportLocations = () => {
  const { airports, setFormData, formData } = useBookedCarDetailsStore();
  const { target, confirmDialog } = usePickupDialogStore();
  const { filters, setFilter } = useUserPreferedFiltersStore();
  const { handleRedirectClick } = usePickupRedirect();
  const t = useTranslations("home");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const selectedAirportValue =
    target === "return"
      ? formData.returnType === "AIRPORT" && formData.returnAirportId != null
        ? `airport-${formData.returnAirportId}`
        : ""
      : formData.pickupType === "AIRPORT" && formData.pickupAirportId != null
        ? `airport-${formData.pickupAirportId}`
        : filters.pickupType === "airport" && filters.pickupId
          ? `airport-${filters.pickupId}`
          : "";

  const handleValueChange = (value: string) => {
    const airportId = value.split("-")[1];
    const airport = airports?.find((a) => a.airportId.toString() === airportId);
    if (airport) {
      const selectedAirportName =
        locale === "ar" ? airport.arabicName : airport.englishName;
      if (target === "return") {
        setFormData({
          returnAirportId: airport.airportId as number,
          carReturnLocation: selectedAirportName,
          returnType: "AIRPORT",
          returnTrainId: null,
          carReturnLocationId: null,
          returnLat: null,
          returnLong: null,
        });
      } else {
        setFormData({
          pickupAirportId: airport.airportId as number,
          pickupName: selectedAirportName,
          pickupType: "AIRPORT",
          pickupTrainId: null,
          pickupId: null,
          pickupLat: null,
          pickupLong: null,
        });
        setFilter("pickupType", "airport");
        setFilter("pickupId", String(airport.airportId));
        setFilter("pickupName", selectedAirportName);
      }
      confirmDialog();
    }
  };

  const hasAirports = (airports?.length ?? 0) > 0;

  return (
    <>
      <div className="w-full h-full min-h-0 flex flex-col">
        {hasAirports ? (
          <RadioGroup
            dir={dir}
            className="flex flex-col gap-y-2 w-[95%] mx-auto mt-2"
            onValueChange={handleValueChange}
            value={selectedAirportValue}
          >
            <p className="text-base font-bold">
              {t("pickupDialog.popularLocations.airports")}
            </p>
            <p className="w-full text-[12px] text-StatusRed flex items-center gap-2">
              <Info className="size-4" />
              هذه المطارات متاحة للحجز مع هذه السيارة فقط ولا تنطبق على باقي
              السيارات.
            </p>

            {airports?.map((airport) => {
              return (
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
              );
            })}
          </RadioGroup>
        ) : (
          <div className="w-full flex-1 min-h-0 flex items-center justify-center">
            <EmptyLocationContent
              content={
                <div className="flex flex-col gap-2 justify-center items-center text-center text-[15px]">
                  <p className="text-StatusRed">
                    خدمة التسليم/ الاستلام في المطارات غير متوفرة لهذه السيارة
                    حالياً.
                  </p>

                  <p>
                    يمكنك بسهولة العثور على سيارات تدعم التسليم/ الاستلام في
                    المطارات بتحديد مكان الاستلام .
                  </p>

                  <p className="flex gap-0.5">
                    <span>من</span>
                    <span
                      className="underline font-bold underline-offset-4 cursor-pointer"
                      onClick={(event) => handleRedirectClick(event, "/")}
                    >
                      الصفحة الرئيسية
                    </span>
                    <span className="px-0.5">أو</span>
                    <span
                      className="underline font-bold underline-offset-4 cursor-pointer"
                      onClick={(event) =>
                        handleRedirectClick(event, "/bookings")
                      }
                    >
                      التصفية
                    </span>
                  </p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AirportLocations;
