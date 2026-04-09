import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface PaginationDateViewProps {
  shown: string;
  total: string;
  className?: string;
  loading?: boolean;
}

const PaginationDateView = ({
  shown,
  total,
  className,
  loading,
}: PaginationDateViewProps) => {
  return (
    <div className={cn("flex items-center justify-evenly", className)}>
      {loading ? (
        <Skeleton className="rounded-lg font-bold bg-Grey100 h-8 w-10" />
      ) : (
        <p className="px-4 py-1 rounded-lg font-bold bg-Grey100">{shown}</p>
      )}
      <p className="p-2 rounded-lg ">من أصل</p>
      {loading ? (
        <Skeleton className="rounded-lg font-bold bg-Grey100 h-8 w-10" />
      ) : (
        <p className="px-4 py-1 rounded-lg font-bold bg-Grey100">{total} </p>
      )}
    </div>
  );
};

export default PaginationDateView;
