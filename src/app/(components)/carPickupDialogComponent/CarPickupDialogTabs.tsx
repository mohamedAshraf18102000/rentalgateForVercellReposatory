import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import WrapperContainer from "../wrapperContainer/WrapperContainer";
import UserCurrentLocation from "./TabsContent/UserCurrentLocation";
import AirportLocations from "./TabsContent/AirportLocations";
import TrainLocations from "./TabsContent/TrainLocations";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

const CarPickupDialogTabs = ({
  customDefaultValue,
}: {
  customDefaultValue: string;
}) => {
  const {
    activeTab,
    setActiveTab,
    isCurrentLocationTabDisabled,
    target,
    confirmDialog,
  } = usePickupDialogStore();
  const { carDetails, setFormData, airports, trainStations } =
    useBookedCarDetailsStore();
  const { latitude, longitude } = useLocationStore();
  const t = useTranslations("home");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isAirportTabDisabled = airports.length === 0;
  const isTrainStationTabDisabled = trainStations.length === 0;

  useEffect(() => {
    if (activeTab === "airport" && isAirportTabDisabled) {
      setActiveTab("currentLocation");
    }

    if (activeTab === "trainStation" && isTrainStationTabDisabled) {
      setActiveTab("currentLocation");
    }
  }, [
    activeTab,
    isAirportTabDisabled,
    isTrainStationTabDisabled,
    setActiveTab,
  ]);

  const handleBranchSelection = () => {
    if (!carDetails) return;

    if (target === "return") {
      setFormData({
        carReturnLocationId: carDetails.branchId.toString(),
        carReturnLocation: carDetails.branchName,
        returnType: "BRANCH",
        returnTrainId: null,
        returnAirportId: null,
        returnLat: latitude,
        returnLong: longitude,
      });
    } else {
      setFormData({
        pickupId: carDetails.branchId.toString(),
        pickupName: carDetails.branchName,
        pickupType: "BRANCH",
        pickupTrainId: null,
        pickupAirportId: null,
        pickupLat: latitude,
        pickupLong: longitude,
      });
    }

    confirmDialog();
  };

  return (
    <Tabs
      dir={dir}
      className="w-full bg-transparent"
      value={activeTab}
      defaultValue={customDefaultValue}
      onValueChange={(value) => {
        setActiveTab(value as any);
        if (value === "branches") {
          handleBranchSelection();
        }
      }}
    >
      <WrapperContainer className="w-full">
        <TabsList className="flex items-start justify-center mx-auto text-sm md:text-base">
          <TabsTrigger
            className={
              isCurrentLocationTabDisabled
                ? "text-xs md:text-sm cursor-not-allowed opacity-60"
                : "text-xs md:text-sm"
            }
            value="currentLocation"
            disabled={isCurrentLocationTabDisabled}
          >
            {t("pickupDialog.tabs.currentLocation")}
          </TabsTrigger>
          <TabsTrigger
            title={
              isAirportTabDisabled
                ? t("pickupDialog.tabs.airportUnavailable")
                : undefined
            }
            className={
              isAirportTabDisabled
                ? "text-xs md:text-sm cursor-not-allowed opacity-60"
                : "text-xs md:text-sm"
            }
            value="airport"
            disabled={isAirportTabDisabled}
          >
            {t("pickupDialog.tabs.airport")}
          </TabsTrigger>
          <TabsTrigger
            title={
              isTrainStationTabDisabled
                ? t("pickupDialog.tabs.trainStationUnavailable")
                : undefined
            }
            className={
              isTrainStationTabDisabled
                ? "text-xs md:text-sm cursor-not-allowed opacity-60"
                : "text-xs md:text-sm "
            }
            value="trainStation"
            disabled={isTrainStationTabDisabled}
          >
            {t("pickupDialog.tabs.trainStation")}
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-sm" value="branches">
            {t("pickupDialog.tabs.branches")}
          </TabsTrigger>
        </TabsList>

        <div className="relative min-h-[450px] max-h-[450px] rounded-2xl overflow-hidden border border-Grey100 shadow-sm mt-3 flex flex-col">
          <TabsContent
            className="w-full h-full min-h-0 mt-0! flex flex-col"
            value="currentLocation"
          >
            <UserCurrentLocation />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col"
            value="airport"
          >
            <AirportLocations />
          </TabsContent>

          <TabsContent
            className="w-full h-full mt-0! flex flex-col"
            value="trainStation"
          >
            <TrainLocations />
          </TabsContent>
        </div>
      </WrapperContainer>
    </Tabs>
  );
};

export default CarPickupDialogTabs;
