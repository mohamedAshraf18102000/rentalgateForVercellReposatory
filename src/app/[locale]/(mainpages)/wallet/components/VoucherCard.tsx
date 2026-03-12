import { SaudiRiyalIcon } from "lucide-react";

const VoucherCard = () => {
  return (
    <div className="border-2 w-full bg-white flex items-end gap-5 rounded-2xl relative overflow-hidden">
      <div className="w-[30%] h-full bg-[url(/offers/offerImage2.png)] bg-cover bg-center bg-no-repeat flex items-end ">
        <p className="text-center w-full bg-StatusGreen/95 py-1 font-bold text-StatusDarkGreen">
          <span>حتي</span> <span>30-10-2025</span>
        </p>
      </div>
      <div className="w-[70%] p-3 ">
        <div className="flex justify-between items-center">
          <p className="text-sm text-Grey700">النقاط المكتسبة</p>
          <p className="bg-StatusGreen border-2 border-StatusDarkGreen px-4 py-2 rounded-xl">
            <span className="text-sm font-extrabold">20</span>{" "}
            <span className="text-sm">نقطة</span>
          </p>
        </div>
        <p className="text-base! font-bold">جائزة اليوم الوطني السعودي</p>
        <div className="flex items-center mt-3">
          <span className="text-Grey600">يمكنك بتوفير:</span>
          <span className="font-bold mx-2">10.00</span>
          <SaudiRiyalIcon />
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;
