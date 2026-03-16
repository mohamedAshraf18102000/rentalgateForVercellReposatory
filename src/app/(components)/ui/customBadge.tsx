import { X } from "lucide-react";

const CustomBadge = ({
  title,
  onClose,
  toolTip,
}: {
  toolTip?: string;
  title: string;
  onClose?: () => void;
}) => {
  return (
    <div
      title={toolTip}
      className="bg-StatusGreen flex gap-1 items-center p-2 w-fit border-StatusDarkGreen border rounded-[12px] text-StatusDarkGreen text-sm whitespace-nowrap"
    >
      <p>{title}</p>
      {onClose && (
        <span className="cursor-pointer" onClick={onClose}>
          <X size={16} />
        </span>
      )}
    </div>
  );
};

export default CustomBadge;
