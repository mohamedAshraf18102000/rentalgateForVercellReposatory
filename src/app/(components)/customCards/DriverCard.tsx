import Image from "next/image";
import { useLocale } from "next-intl";

interface ServiceCardProps {
  image: string;
  serviceName: string;
  badgeTitle?: string;
  status?: boolean;
}

const DriverCard = ({
  image,
  serviceName,
  badgeTitle,
  status,
}: ServiceCardProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  if (!status) return null;
  return (
    <div className="relative flex min-h-[92px] overflow-hidden rounded-2xl border-2 border-white">
      <div className="relative w-[30%] min-w-[90px] sm:min-w-[100px]">
        <Image src={`${image}`} fill alt="" className="object-contain " />
      </div>
      <div className="flex h-full w-[75%] items-center bg-white p-2 sm:p-3">
        <p className="text-sm font-extrabold sm:text-base">{serviceName}</p>
      </div>

      <p
        className={`absolute -top-1 bg-gray-100 px-2 py-1 text-xs font-bold sm:p-2 sm:text-sm ${
          isRTL ? "left-0 rounded-r-xl" : "right-0 rounded-l-xl"
        }`}
      >
        {badgeTitle}
      </p>
    </div>
  );
};

export default DriverCard;
