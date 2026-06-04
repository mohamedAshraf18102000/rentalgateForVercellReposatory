import { Separator } from "@/app/(components)/ui/separator";
import { Skeleton } from "@/app/(components)/ui/skeleton";

const BookedCarDetailsDrawerSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-34 w-full rounded-2xl bg-Grey200 mt-5" />
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-34 w-full rounded-2xl sm:w-[40%] bg-Grey200" />
        <div className="flex w-full flex-col gap-y-2">
          <Skeleton className="h-10 w-28 rounded-lg bg-Grey200" />
          <Skeleton className="h-5 w-44 bg-Grey200" />
          <Skeleton className="h-5 w-36 bg-Grey200" />
        </div>
      </div>
      <Separator className="my-3" />
      <Skeleton className="h-20 w-full rounded-2xl bg-Grey200" />
      <Separator className="my-3" />
      <Skeleton className="h-24 w-full rounded-2xl bg-Grey200" />
      <Separator className="my-3" />
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-24 bg-Grey200" />
        <Skeleton className="h-6 w-16 bg-Grey200" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg bg-Grey200" />
    </div>
  );
};

export default BookedCarDetailsDrawerSkeleton;
