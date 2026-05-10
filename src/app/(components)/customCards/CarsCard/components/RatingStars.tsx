import StarIcon from "@/constants/icons/StarIcon";

export const MAX_STAR_RATING = 5;

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
}

export default function RatingStars({
  rating,
  maxStars = MAX_STAR_RATING,
}: RatingStarsProps) {
  const clamped = Math.min(maxStars, Math.max(0, rating));

  return (
    <div dir="ltr" className="flex items-center gap-0.5" role="presentation">
      {Array.from({ length: maxStars }, (_, i) => {
        const remainder = clamped - i;
        if (remainder >= 1) {
          return (
            <span key={i} className="inline-flex shrink-0">
              <StarIcon />
            </span>
          );
        }
        if (remainder > 0) {
          return (
            <span
              key={i}
              className="relative inline-block h-[13px] w-[14px] shrink-0"
            >
              <span className="pointer-events-none absolute inset-0 opacity-25">
                <StarIcon />
              </span>
              <span
                className="absolute left-0 top-0 h-[13px] overflow-hidden"
                style={{ width: `${remainder * 100}%` }}
              >
                <StarIcon className="block" />
              </span>
            </span>
          );
        }
        return (
          <span key={i} className="inline-flex shrink-0 opacity-25">
            <StarIcon />
          </span>
        );
      })}
    </div>
  );
}
