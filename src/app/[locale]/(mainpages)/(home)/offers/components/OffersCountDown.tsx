import Image from "next/image";

const OffersCountDown = () => {
  return (
    <div className="bg-Green200 p-2 rounded-[8px] flex items-center gap-3 mt-3">
      <Image
        width={100}
        height={100}
        className="object-contain w-6 h-6"
        src="/shared/FestivalIcon.png"
        alt="offer"
      />
      <p className="font-bold text-base">
        أفضل عروض التأجير اليومية متبقي{" "}
        <span className="bg-white p-1 rounded-[5px]">10</span>
        <span className="mx-1">:</span>
        <span className="bg-white p-1 rounded-[5px]">10</span>
        <span className="mx-1">ساعات</span>
      </p>
      <Image
        width={100}
        height={100}
        className="object-contain w-6 h-6"
        src="/shared/FestivalIcon.png"
        alt="offer"
      />
    </div>
  );
};

export default OffersCountDown;
