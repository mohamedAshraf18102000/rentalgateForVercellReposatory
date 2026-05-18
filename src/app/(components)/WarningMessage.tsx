import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

const WarningMessage = ({
  message,
  className,
  errorClassName,
}: {
  message: string;
  className?: string;
  errorClassName?: string;
}) => {
  return (
    <div
      className={`w-fit flex items-center rounded-lg gap-1 mt-2 ${className}`}
    >
      <CircleAlert className="h-4 w-4 text-StatusRed" />
      <p
        className={cn(
          "text-xs text-StatusRed font-medium line-clamp-2 leading-relaxed",
          errorClassName,
        )}
      >
        {message}
      </p>
    </div>
  );
};

export default WarningMessage;
