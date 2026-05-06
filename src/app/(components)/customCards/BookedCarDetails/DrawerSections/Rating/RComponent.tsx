import { Star, UserStar } from "lucide-react";

type TRatingComponent = {
  title: string;
  description: string;
  rating: number;
  onRating: (rating: number) => void;
  icon?: React.ReactNode;
};

const RComponent = ({
  title,
  description,
  rating,
  onRating,
  icon,
}: TRatingComponent) => {
  return (
    <div className="bg-Grey100 w-full h-50 rounded-xl my-3 flex flex-col items-center justify-center gap-2 p-3">
      {icon || <UserStar className="w-10 h-10" />}
      <p className="font-bold text-base"> {title}</p>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Set rating to ${index + 1}`}
            onClick={() => onRating(index + 1)}
            className="cursor-pointer"
          >
            <Star
              className={`w-6 h-6 ${
                index < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-Grey400"
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-base text-Grey700 w-3/4 text-center">{description}</p>
    </div>
  );
};

export default RComponent;
