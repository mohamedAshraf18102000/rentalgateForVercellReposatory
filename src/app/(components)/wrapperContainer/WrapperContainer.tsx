import { cn } from "@/lib/utils";

interface WrapperContainerProps {
  children: React.ReactNode;
  className?: string;
  exceedNav?: boolean;
}

const WrapperContainer = ({
  children,
  className,
  exceedNav,
}: WrapperContainerProps) => {
  return (
    <section
      className={cn("w-[90%] mx-auto", exceedNav && "mt-5 sm:mt-25 md:mt-25", className)}
    >
      {children}
    </section>
  );
};

export default WrapperContainer;
