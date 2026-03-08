import { X } from "lucide-react";

const CustomBadge = ({ title }: { title: string }) => {
  return (
    <div className="bg-StatusGreen flex gap-1 items-center p-2 w-fit border-StatusDarkGreen border rounded-[12px] text-StatusDarkGreen text-base">
      <p>{title}</p>
      <span className="cursor-pointer">
        <X size={18} />
      </span>
    </div>
  );
};

export default CustomBadge;
