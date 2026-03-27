import { SaudiRiyal } from "lucide-react";
import Image from "next/image";

const Points = () => {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)] text-white">
      <div className="w-[50px] h-[50px] relative rounded-2xl overflow-hidden">
        <Image
          className="object-fill scale-120"
          src="/profile/coin.png"
          alt="userImage"
          fill
        />
      </div>

      <div className="">
        <p className="text-base">255 نقطة</p>
        <p className="text-sm">20 نقطة سارية حتى 30-03-2025</p>
      </div>

      <div className="flex items-center text-lg">
        <p>1,200.00</p>
        <SaudiRiyal />
      </div>
    </div>
  );
};

export default Points;
