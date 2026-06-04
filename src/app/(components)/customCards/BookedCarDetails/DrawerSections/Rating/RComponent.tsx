import { Label } from "@/app/(components)/ui/label";
import { Textarea } from "@/app/(components)/ui/textarea";
import TextAreaIcon from "@/constants/icons/profile/TextAreaIcon";
import { Star, UserStar } from "lucide-react";
type TRatingComponent = {
  title: string;
  description: string;
  value: number;
  onChange: (rating: number) => void;
  icon?: React.ReactNode;
  includeComment?: boolean;
  commentValue?: string;
  onCommentChange?: (value: string) => void;
  commentDisabled?: boolean;
};

const RComponent = ({
  title,
  description,
  value,
  onChange,
  icon,
  includeComment = false,
  commentValue = "",
  onCommentChange,
  commentDisabled = false,
}: TRatingComponent) => {
  return (
    <div className="bg-Grey100 w-full rounded-xl my-3 flex flex-col items-center justify-center gap-2 p-3">
      {icon || <UserStar className="w-10 h-10" />}

      <p className="font-bold text-base">{title}</p>

      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index + 1)}
            aria-label={`Set rating to ${index + 1}`}
          >
            <Star
              className={`w-6 h-6 ${
                index < value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-Grey400"
              }`}
            />
          </button>
        ))}
      </div>

      <p className="text-base text-Grey700 w-3/4 text-center">{description}</p>

      {includeComment && (
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-base text-[#0D0D0D] font-bold! my-2">
            ملاحظات:
          </Label>

          <Textarea
            startIcon={<TextAreaIcon />}
            name="message"
            value={commentValue}
            onChange={(event) => onCommentChange?.(event.target.value)}
            placeholder="اكتب تقييمك"
            disabled={commentDisabled}
            className="min-h-28 text-base! bg-white pt-4"
          />
        </div>
      )}
    </div>
  );
};

export default RComponent;
