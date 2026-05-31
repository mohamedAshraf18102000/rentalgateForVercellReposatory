"use client";
// import { getTrainstations } from "@/services/pickupLocations/trainStations.service";
import { Info, TrainFront } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useLocale, useTranslations } from "next-intl";
import EmptyLocationContent from "./EmptyLocationContent/EmptyLocationContent";
import { usePickupRedirect } from "./usePickupRedirect";

const TrainLocations = () => {
  const { trainStations, setFormData, formData } = useBookedCarDetailsStore();
  const { target, confirmDialog } = usePickupDialogStore();
  const { filters, setFilter } = useUserPreferedFiltersStore();
  const { handleRedirectClick } = usePickupRedirect();
  const t = useTranslations("home");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const selectedTrainValue =
    target === "return"
      ? formData.returnType === "TRAIN_STATION" &&
        formData.returnTrainId != null
        ? `station-${formData.returnTrainId}`
        : ""
      : formData.pickupType === "TRAIN_STATION" &&
          formData.pickupTrainId != null
        ? `station-${formData.pickupTrainId}`
        : filters.pickupType === "trainStation" && filters.pickupId
          ? `station-${filters.pickupId}`
          : "";

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
        setFilter("carReturnLocationType", "trainStation");
        setFilter("carReturnTrainId", station.stationId);
        setFilter("carReturnAirportId", undefined);
        setFilter("carReturnLocation", selectedStationName);
        setFilter("carReturnLocationId", String(station.stationId));
        setFilter("carReturnLocationLat", undefined);
        setFilter("carReturnLocationLng", undefined);
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
        setFilter("pickupType", "trainStation");
        setFilter("pickupId", String(station.stationId));
        setFilter("pickupName", selectedStationName);
      }
      confirmDialog();
    }
  };

  const hasTrainStations = (trainStations?.length ?? 0) > 0;

  return (
    <div className="w-full h-full min-h-0 flex flex-col">
      {hasTrainStations ? (
        <RadioGroup
          dir={dir}
          className="flex flex-col gap-y-2 w-[95%] mx-auto mt-2"
          onValueChange={handleValueChange}
          value={selectedTrainValue}
        >
          <p className="text-base font-bold">
            {t("pickupDialog.popularLocations.trainStations")}
          </p>
          <p className="w-full text-[12px] text-StatusRed flex items-center gap-2">
            <Info className="size-4" />
            {t("pickupDialog.popularLocations.trainStationsCarOnlyNotice")}
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
      ) : (
        <div className="w-full flex-1 min-h-0 flex items-center justify-center">
          <div className="w-full flex-1 min-h-0 flex items-center justify-center">
            <EmptyLocationContent
              content={
                <div className="flex flex-col gap-2 justify-center items-center text-center text-[15px]">
                  <p className="text-StatusRed">
                    {t("pickupDialog.emptyState.trainStation.unavailable")}
                  </p>

                  <p>{t("pickupDialog.emptyState.trainStation.suggestion")}</p>

                  <p className="flex gap-0.5">
                    <span>{t("pickupDialog.emptyState.redirectFrom")}</span>
                    <span
                      className="underline font-bold underline-offset-4 cursor-pointer"
                      onClick={(event) => handleRedirectClick(event, "/")}
                    >
                      {t("pickupDialog.emptyState.homePage")}
                    </span>
                    <span className="px-0.5">
                      {t("pickupDialog.emptyState.redirectOr")}
                    </span>
                    <span
                      className="underline font-bold underline-offset-4 cursor-pointer"
                      onClick={(event) =>
                        handleRedirectClick(event, "/bookings")
                      }
                    >
                      {t("pickupDialog.emptyState.filtering")}
                    </span>
                  </p>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainLocations;
