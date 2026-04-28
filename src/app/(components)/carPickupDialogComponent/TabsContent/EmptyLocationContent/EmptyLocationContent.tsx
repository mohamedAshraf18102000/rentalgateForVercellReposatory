import { useRouter } from "next/navigation";
import InfoSVGIcon from "../../../../../../public/extraSVGIcons/InfoSVGIcon";

const EmptyLocationContent = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className=" bg-[#2D0001] rounded-full flex items-center justify-center">
        <InfoSVGIcon />
      </div>
      <p>
        يمكنك اختيار مكان الاستلام من{" "}
        <span
          onClick={() => router.push("/")}
          className="underline font-semibold underline-offset-4 cursor-pointer"
        >
          الصفحة الرئيسية
        </span>{" "}
        للحصول على افضل نتائج.
      </p>
    </div>
  );
};

export default EmptyLocationContent;
