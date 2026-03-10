import { cn } from "@/lib/utils";

interface PaginationDateViewProps {
  shown: string;
  total: string;
  className?: string;
}

const PaginationDateView = ({ shown, total, className }: PaginationDateViewProps) => {
  return (
    <div className={cn("flex items-center justify-evenly", className)}>
      <p className="px-4 py-1 rounded-lg font-bold bg-Grey100">{shown}</p>
      <p className="p-2 rounded-lg ">من أصل</p>
      <p className="px-4 py-1 rounded-lg font-bold bg-Grey100">{total} </p>
    </div>
  );
};

export default PaginationDateView;
