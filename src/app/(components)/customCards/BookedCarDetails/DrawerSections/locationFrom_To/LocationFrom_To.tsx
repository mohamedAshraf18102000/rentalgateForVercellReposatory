import {
  getLocalizedLocationType,
  LocationLocale,
  LocationType,
} from "@/util/locationType";
import { Dot, MapPin, Minus } from "lucide-react";
import { Locale, useLocale, useTranslations } from "next-intl";

interface LocationFromToProps {
  receiveLocationName?: string;
  deliverLocationName?: string;
  receiveAddress?: string | null;
  deliverAddress?: string | null;
  showPhysicalAddress?: boolean;
  LocReceiveType?: LocationType;
  LocDeliverType?: LocationType;
}

const LocationFrom_To = ({
  receiveLocationName,
  deliverLocationName,
  receiveAddress,
  deliverAddress,
  showPhysicalAddress = true,
  LocReceiveType,
  LocDeliverType,
}: LocationFromToProps) => {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Dot className=" w-8 h-8 mx-2" />
        {/* Location From Label */}
        <span>{t("myBookingsDrawer.locationChange.fromLabel")}</span>
        {LocReceiveType && (
          <span className="mx-0.5 font-bold">
            {getLocalizedLocationType(LocReceiveType, locale as LocationLocale)}
          </span>
        )}
        <span>-</span>
        <span title={receiveLocationName} className="mx-2 line-clamp-1">
          {showPhysicalAddress ? receiveLocationName : receiveAddress}
        </span>
      </div>
      <div className="flex items-center">
        <Minus className="rotate-90 w-8 h-8 mx-2" />
      </div>
      <div className="flex items-center">
        <MapPin className=" w-6 h-6 mx-3" />
        <span>{t("myBookingsDrawer.locationChange.toLabel")}</span>
        {/* Location To Label */}
        {LocReceiveType && (
          <span className="mx-0.5 font-bold">
            {getLocalizedLocationType(LocReceiveType, locale as LocationLocale)}
          </span>
        )}
        <span>-</span>
        <span title={deliverLocationName} className="mx-2 line-clamp-1">
          {showPhysicalAddress ? deliverLocationName : deliverAddress}
        </span>
      </div>
    </div>
  );
};

export default LocationFrom_To;
