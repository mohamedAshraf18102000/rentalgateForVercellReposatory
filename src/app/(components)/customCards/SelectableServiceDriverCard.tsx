"use client";

import { CompanyService } from "@/types/companyCars/carServices";
import { CircleAlert, Minus, Plus, SaudiRiyal } from "lucide-react";
import { Badge } from "../ui/badge";

interface SelectableServiceDriverCardProps {
  service?: CompanyService;
  selected?: boolean;
  onToggle?: () => void;
  badge?: string;
}

const SelectableServiceDriverCard = ({
  service,
  selected,
  onToggle,
  badge,
}: SelectableServiceDriverCardProps) => {
  return (
    <>
      <label
        dir="rtl"
        className={`
        w-full text-right rounded-lg py-2 px-4 flex flex-col gap-2 transition-all duration-300 relative overflow-hidden cursor-pointer
        ${
          selected
            ? "bg-white border-primary border-[0.5px] shadow-lg"
            : "bg-Grey100 border-transparent hover:border-gray-200"
        }
      `}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="sr-only"
        />
        <div className="flex items-start justify-between gap-4 w-full">
          {/* Checkbox indicator - Top Right in RTL */}
          <div
            className={`
            shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 order-1
            ${selected ? "bg-black" : "bg-white border-2 border-gray-100"}
          `}
          >
            {selected && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={4}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          {/* Service info - to the left of checkbox in RTL */}
          <div className="flex-1 min-w-0 pr-0 text-right order-2">
            <p className="font-bold text-base text-gray-900 leading-tight">
              سائق خاص
              <span className="text-base font-normal mx-1">
                (اليوم = 8 ساعات)
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium line-clamp-2 leading-relaxed">
              لا يمكن الإستفادة من خدمة السائق إلا داخل المدينة المحددة
            </p>

            <div className="bg-white p-2 w-fit flex items-center rounded-lg mt-3">
              <p className="font-bold">عدد الساعات في اليوم:</p>
              <div className="flex items-center gap-2 mx-2">
                <button className="bg-gray-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center font-bold hover:bg-red-200 transition duration-300 cursor-pointer">
                  <Minus />
                </button>
                <span className="font-bold">1</span>
                <button className="bg-gray-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center font-bold hover:bg-green-200 transition duration-300 cursor-pointer">
                  <Plus />
                </button>
              </div>
            </div>

            <div className="w-fit flex items-center rounded-lg gap-1 mt-2">
              <CircleAlert className="h-4 w-4 text-StatusRed" />
              <p className="text-xs text-StatusRed font-medium line-clamp-2 leading-relaxed">
                خدمة السائق محددة ب 8 ساعات و إن زادت تكون بتكلفة إضافية أخرى.
              </p>
            </div>

            <div className=" w-fit flex items-center rounded-lg gap-1">
              <CircleAlert className="h-4 w-4 text-StatusRed" />
              <p className="text-xs text-StatusRed font-medium line-clamp-2 leading-relaxed">
                حد اقصى لعدد ساعات اليوم 12 ساعة
              </p>
            </div>

            <div className="bg-white p-2 w-fit flex items-center rounded-lg mt-3">
              <p className="font-bold">عدد الأيام:</p>
              <div className="flex items-center gap-2 mx-2">
                <button className="bg-gray-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center font-bold hover:bg-red-200 transition duration-300 cursor-pointer">
                  <Minus />
                </button>
                <span className="font-bold">1</span>
                <button className="bg-gray-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center font-bold hover:bg-green-200 transition duration-300 cursor-pointer">
                  <Plus />
                </button>
              </div>
            </div>
            <div className=" w-fit flex items-center rounded-lg gap-1 mt-2">
              <CircleAlert className="h-4 w-4 text-StatusRed" />
              <p className="text-xs text-StatusRed font-medium line-clamp-2 leading-relaxed">
                مدة الحجز الخاصة بك هي (3 أيام)
              </p>
            </div>

            <div className=" w-fit flex items-center rounded-lg gap-1 mt-2">
              <p className="line-through text-base text-Grey500">15</p>
              <p className="font-bold text-lg">15</p>
              <SaudiRiyal className="w-5 h-5" />
              <p className="">/</p>
              <p className="">يوم</p>
            </div>
          </div>
          {badge && (
            <Badge className="text-sm font-bold absolute top-2 left-2 bg-StatusGreen text-StatusDarkGreen border-2 border-StatusDarkGreen p-4 rounded-lg">
              {badge}
            </Badge>
          )}
        </div>
      </label>
    </>
  );
};

export default SelectableServiceDriverCard;
