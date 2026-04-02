import Image from "next/image";

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
  if (!status) return null;
  return (
    <div className="rounded-2xl w-fill flex overflow-hidden relative border-2 border-white">
      <div className="relative w-[25%] h-[92PX]">
        <Image src={`${image}`} fill alt="" className="object-contain " />
      </div>
      <div className="bg-white w-[75%] p-2 h-full flex items-center ">
        <p className="font-extrabold text-base">{serviceName}</p>
      </div>

      <p className="bg-gray-100 absolute left-0 -top-1 p-2 rounded-r-xl font-bold">
        {badgeTitle}
      </p>
    </div>
  );
};

export default DriverCard;
