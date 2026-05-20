import { cn } from "@/lib/utils";

const RoundedRec = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn("block h-6 w-full", className)}
      viewBox="0 0 342 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M24 24V0C19.1023 0 14.7449 3.10972 13.1526 7.74136L9.5265 18.2891C8.53507 21.173 5.9903 23.2424 2.96485 23.625L0 24H24Z"
        fill="white"
      />
      <rect width="294" height="24" transform="translate(24)" fill="white" />
      <path
        d="M318 24V0C322.898 0 327.255 3.10972 328.847 7.74136L332.473 18.2891C333.465 21.173 336.01 23.2424 339.035 23.625L342 24H318Z"
        fill="white"
      />
    </svg>
  );
};

export default RoundedRec;
