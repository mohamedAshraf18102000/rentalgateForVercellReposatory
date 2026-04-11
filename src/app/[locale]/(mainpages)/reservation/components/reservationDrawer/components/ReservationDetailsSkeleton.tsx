import { Skeleton } from "@/app/(components)/ui/skeleton";

const ReservationDetailsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2 mb-6 overflow-y-auto">
          <div>
            <Skeleton className="rounded-md h-4 bg-Grey200 w-[25%]" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="rounded-md h-4 bg-Grey200 w-[55%]" />
            <Skeleton className="rounded-md h-4 bg-Grey200 w-[35%]" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ReservationDetailsSkeleton;
