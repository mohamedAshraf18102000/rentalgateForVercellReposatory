"use client";
import { Copy, Share2 } from "lucide-react";
import { useRef } from "react";

interface userReferalProps {
  referalCode: string;
}

const UserReferal = ({ referalCode }: userReferalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
      console.log("تم النسخ");
    }
  };

  return (
    <div className="rounded-2xl p-2 bg-[url(/profile/panner.png)] h-[270px] bg-cover w-full flex flex-col justify-center text-white">
      {/* hidden input */}
      <input
        ref={inputRef}
        value={referalCode}
        readOnly
        className="absolute opacity-0 pointer-events-none"
      />

      <div className="w-[60%] p-3">
        <h4 className="text-lg font-extrabold">تحب تكسب خصومات؟!!</h4>
        <p className="text-sm w-3/4">
          لكل حد هترشحه هتكسب 50% خصم على مدة الإيجار
        </p>
      </div>

      <div className="w-[60%] p-3 mt-5">
        <h4 className="text-lg font-extrabold">شارك الكود:</h4>

        <div className="flex items-center justify-between p-2 px-4 bg-white text-black rounded-xl mt-2">
          <p className="text-base">{referalCode}</p>

          <div className="flex items-center gap-2">
            <Share2 size={24} className="text-Grey700 cursor-pointer" />
            <Copy
              size={24}
              className="text-Grey700 cursor-pointer"
              onClick={handleCopy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReferal;
