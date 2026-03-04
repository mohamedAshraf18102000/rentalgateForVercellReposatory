import { PlaneTakeoff } from "lucide-react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";

const AirportLocations = () => {
  return (
    <div className="w-full h-full overflow-y-auto ">
      <RadioGroup
        dir="rtl"
        defaultValue="airport-1"
        className="flex flex-col gap-y-2 w-[95%] mx-auto mt-2"
      >
        <p className="text-base font-bold">المطارات الأكثر شهرة:</p>
        {[1, 2, 3, 4].map((i) => (
          <div className="" key={i}>
            <div className="flex items-center gap-4 p-2 rounded-lg mx-auto hover:bg-Grey100">
              <Label
                htmlFor={`airport-${i}`}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <PlaneTakeoff
                  className="text-primary  transition-colors"
                  size={20}
                />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm truncate">
                    مطار الملك خالد الدولي {i > 1 ? i : ""}
                  </p>
                </div>
              </Label>
              <RadioGroupItem
                className="border-primary border-2 h-6 w-6"
                value={`airport-${i}`}
                id={`airport-${i}`}
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
