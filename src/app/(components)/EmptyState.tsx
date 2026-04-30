import { cn } from "@/lib/utils";

const EmptyState = ({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "col-span-full flex h-[350px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center text-sm text-Grey700 sm:text-base",
        className,
      )}
    >
      <img
        src="/notFound/notFound.webp"
        alt={title}
        className="w-[250px] h-[250px] "
      />
      <span className="text-base mt-3">{description}</span>
    </div>
  );
};

export default EmptyState;
