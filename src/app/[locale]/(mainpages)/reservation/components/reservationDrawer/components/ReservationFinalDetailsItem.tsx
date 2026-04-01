import { SaudiRiyal } from "lucide-react";
import { ReactNode } from "react";

const ReservationFinalDetailsItem = ({
  itemHeader,
  items,
  offer,
}: {
  itemHeader?: string;
  items: { label: string; value: ReactNode }[];
  offer?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {itemHeader && <p className="text-base font-bold">{itemHeader}</p>}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-base"
          >
            <p className="font-medium text-Grey700">{item.label}</p>
            <div
              className={`flex items-center gap-1 ${offer ? "bg-StatusGreen" : ""} p-1 rounded-lg`}
            >
              <p>{item.value}</p>
              <SaudiRiyal className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationFinalDetailsItem;
