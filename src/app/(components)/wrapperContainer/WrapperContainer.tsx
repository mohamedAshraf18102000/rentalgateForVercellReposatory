import { cn } from "@/lib/utils";

interface WrapperContainerProps {
  children: React.ReactNode;
  className?: string;
}

const WrapperContainer = ({ children, className }: WrapperContainerProps) => {
  return <div className={cn("w-[90%] mx-auto", className)}>{children}</div>;
};

export default WrapperContainer;
