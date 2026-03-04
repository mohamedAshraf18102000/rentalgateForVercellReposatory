import { ChevronLeft } from "lucide-react";
import GoogleMapsLocation from "../../mapsLocation/GoogleMapsLocation";

const BranchesLocations = () => {
  return (
    <>
      {/* CONTENT */}
      <div className="w-full h-full">
        <GoogleMapsLocation />
      </div>

      <div className="absolute px-4 py-3 bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-primary shadow-2xl border border-Grey100 w-[94%] rounded-2xl z-20">
        <div className="flex justify-between items-center mb-3">
          <h5 className="font-bold text-base">العناوين المسجلة</h5>
          <button className="font-bold text-sm border-2 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-Grey200 transition-colors">
            عرض الكل <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-Grey100 p-3 rounded-xl hover:border-primary/30 transition-all cursor-pointer shadow-sm group"
            >
              <p className="font-bold text-xs mb-1 group-hover:text-primary">
                فرع العمل رقم {index + 1}
              </p>
              <p className="line-clamp-1 text-Grey600 text-[10px] leading-tight">
                {index + 1} شارع فاطمة الزهراء حي...
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BranchesLocations;
