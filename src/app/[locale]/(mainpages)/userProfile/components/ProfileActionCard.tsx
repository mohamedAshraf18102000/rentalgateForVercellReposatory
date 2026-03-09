"use client";
import { ChevronLeft } from "lucide-react";

interface ProfileActionCardProps {
  title: string;
  description: string;
  icon: string;
  bg_gray?: boolean;
  onClick?: () => void;
}

const ProfileActionCard = ({
  title,
  description,
  icon,
  onClick,
  bg_gray,
}: ProfileActionCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-3 flex items-center justify-between cursor-pointer ${bg_gray ? "bg-Grey100" : "bg-white shadow-lg"}`}
    >
      <div className="flex items-center gap-2">
        <img src={icon} alt="img" className="w-[40px] h-[40px]" />
        <div>
          <p className="text-base font-bold">{title}</p>
          <p className="text-sm text-Grey700 mt-1">{description}</p>
        </div>
      </div>
      <ChevronLeft className="h-5 w-5 shrink-0 transition-transform duration-200" />
    </div>
  );
};

export default ProfileActionCard;
