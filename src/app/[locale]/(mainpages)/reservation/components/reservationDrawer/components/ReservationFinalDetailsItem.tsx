import { Skeleton } from "@/app/(components)/ui/skeleton";
import { Separator } from "@base-ui/react";
import { SaudiRiyal } from "lucide-react";
import { ReactNode } from "react";

const ReservationFinalDetailsItem = ({
  itemHeader,
  items,
  offer,
  largeText,
  showSeparator,
}: {
  itemHeader?: string;
  showSeparator?: boolean;
  largeText?: boolean;
  items: {
    label: string;
    value: ReactNode;
    isAvailable?: boolean;
    icon?: ReactNode;
    isCalculating?: boolean;
  }[];
  offer?: boolean;
}) => {
  const filteredItems = items.filter((item) => item.isAvailable !== false);

  if (filteredItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {showSeparator && <Separator className="my-0! bg-Grey400!" />}
      {itemHeader && <p className="text-base font-bold">{itemHeader}</p>}
      <div className="flex flex-col gap-3">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between gap-2 text-base sm:items-center"
          >
            <p
              className={`font-medium text-Grey700 ${largeText ? "text-base" : "text-sm"} max-w-[60%] sm:max-w-none`}
            >
              {item.label}
            </p>
            <div
              className={`flex shrink-0 items-center gap-1 ${largeText ? "text-base" : "text-sm"} ${offer ? "bg-StatusGreen text-StatusDarkGreen" : ""} rounded-lg p-1`}
            >
              {item.isCalculating ? (
                <Skeleton className="bg-Grey400 h-4 w-8" />
              ) : (
                <div className={`flex items-center`}>
                  <div>{item.value}</div>
                  <span>{item.icon ?? <SaudiRiyal className="h-6 w-6" />}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationFinalDetailsItem;
