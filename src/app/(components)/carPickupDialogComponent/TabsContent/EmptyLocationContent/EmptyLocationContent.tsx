import { useRouter } from "next/navigation";
import InfoSVGIcon from "../../../../../../public/extraSVGIcons/InfoSVGIcon";

interface EmptyLocationContentProps {
  content?: React.ReactNode;
}

const EmptyLocationContent = ({ content }: EmptyLocationContentProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className=" bg-[#2D0001] rounded-full flex items-center justify-center">
        <InfoSVGIcon />
      </div>
      {content}
    </div>
  );
};

export default EmptyLocationContent;
