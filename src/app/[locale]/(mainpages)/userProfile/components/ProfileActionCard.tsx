"use client";
import { ChevronLeft } from "lucide-react";

interface ProfileActionCardProps {
  customIcon?: React.ReactNode;
  title: string;
  description: string;
  icon?: string;
  bg_gray?: boolean;
  active?: boolean;
  trash?: boolean;
  onClick?: () => void;
  onIconClick?: () => void;
}

const ProfileActionCard = ({
  title,
  description,
  icon,
  bg_gray,
  active,
  customIcon,
  trash,
  onClick,
  onIconClick,
}: ProfileActionCardProps) => {
  return (
    <div
      className={`rounded-2xl p-3 flex items-center justify-between cursor-pointer border ${active ? "border-black" : "border-transparent"} ${bg_gray ? "bg-Grey100" : "bg-white shadow-lg"}`}
    >
      <div onClick={onClick} className="flex items-center gap-2">
        {icon && <img src={icon} alt="img" className="w-[40px] h-[40px]" />}
        <div>
          <p className="text-base font-bold">{title}</p>
          <p className="text-sm text-Grey700 mt-1">{description}</p>
        </div>
      </div>
      <button
        onClick={onIconClick}
        className={`h-7 w-7 shrink-0 transition-transform duration-200 ${trash ? "hover:bg-red-200 rounded-full flex items-center justify-center transition-all! duration-200!" : "text-black"}`}
      >
        {customIcon ? customIcon : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ProfileActionCard;
