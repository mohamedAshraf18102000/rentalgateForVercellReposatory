import { Separator } from "@/app/(components)/ui/separator";
import Image from "next/image";

const WalletInfo = () => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative w-[56px] h-[56px] rounded-lg overflow-hidden">
          <Image src="/banner_ar.png" alt="" fill />
        </div>
        <div>
          <p className="font-bold text-lg">أهلاً عبد الرحمن</p>
          <p className="text-sm">قُم بتحديث بياناتك الشخضية و ضبط الأعدادات</p>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">المحفظة</p>
            <p className="text-sm text-Grey700">أستبدل النقاط المكتسبة</p>
          </div>

          <div>
            <p className="bg-StatusGreen border-2 border-StatusDarkGreen px-4 py-2 rounded-xl">
              <span className="text-sm">لديك</span>
              <span className="font-extrabold text-sm mx-1">7539</span>
              <span className="text-sm">نقطة</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletInfo;
