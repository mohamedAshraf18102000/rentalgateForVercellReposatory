import { cn } from "@/lib/utils";

interface WrapperContainerProps {
  children: React.ReactNode;
  className?: string;
}

const WrapperContainer = ({ children, className }: WrapperContainerProps) => {
  return (
    <section className={cn("w-[90%] mx-auto", className)}>{children}</section>
  );
};

export default WrapperContainer;
