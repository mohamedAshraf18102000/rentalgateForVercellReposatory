import { Dot, MapPin, Minus } from "lucide-react";

interface LocationFromToProps {
  receiveLocationName?: string;
  deliverLocationName?: string;
  receiveAddress?: string | null;
  deliverAddress?: string | null;
}

const LocationFrom_To = ({
  receiveLocationName,
  deliverLocationName,
  receiveAddress,
  deliverAddress,
}: LocationFromToProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Dot className=" w-8 h-8 mx-2" />
        <span>من:</span>
        <span title={receiveLocationName} className="mx-2 line-clamp-1">
          {receiveAddress ?? receiveLocationName}
        </span>
      </div>
      <div className="flex items-center">
        <Minus className="rotate-90 w-8 h-8 mx-2" />
      </div>
      <div className="flex items-center">
        <MapPin className=" w-6 h-6 mx-3" />
        <span>إلـى:</span>
        <span title={deliverLocationName} className="mx-2 line-clamp-1">
          {deliverAddress ?? deliverLocationName}
        </span>
      </div>
    </div>
  );
};

export default LocationFrom_To;
