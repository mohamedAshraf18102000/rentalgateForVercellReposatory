"use client";
import { useQuery } from "@tanstack/react-query";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import { getUserPoints } from "@/services/userProfile/getUserPoints.service";

const Points = () => {
  const { data: pointsData, isLoading } = useQuery({
    queryKey: ["userPoints"],
    queryFn: getUserPoints,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)] text-white min-w-[300px] h-[74px] animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-[50px] h-[50px] bg-white/20 rounded-2xl" />
          <div className="w-20 h-5 bg-white/20 rounded-md" />
        </div>
        <div className="w-24 h-6 bg-white/20 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)] text-white min-w-[300px]">
      <div className="flex items-center gap-2">
        <div className="w-[50px] h-[50px] relative rounded-2xl overflow-hidden">
          <Image
            className="object-contain"
            src="/profile/coin.png"
            alt="coin icon"
            fill
          />
        </div>

        <div className="">
          <p className="text-base">
            {pointsData?.availablePoints ?? null} نقطة
          </p>
        </div>
      </div>

      <div className="flex items-center text-lg gap-1">
        <p>{pointsData?.availablePointsValue?.toFixed(2) ?? null}</p>
        <SaudiRiyal className="w-5 h-5" />
      </div>
    </div>
  );
};

export default Points;
