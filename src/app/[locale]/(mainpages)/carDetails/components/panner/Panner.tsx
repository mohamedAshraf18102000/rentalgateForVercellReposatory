import GooglePlay_AppStore from "@/app/(components)/getOnGooglePlay_AppStore/GooglePlay_AppStore";

const Panner = () => {
  return (
    <div className="w-full h-[600px] mt-10 rounded-2xl p-10 border-white border-2 bg-[url(/Panners/CarDetails/panner.png)] bg-cover bg-center bg-no-repeat flex flex-col justify-center ">
      <div className="w-1/3">
        <h4 className="font-bold text-[28px]">
          أستمتع بتجربة تأجير راقية لا تُضاهى
        </h4>
        <p className="text-[20px] mt-4">
          مع تطبيق <span className="font-bold"> "رينتال جيت"</span> سيارتك
          ستجدها في موقعك بكل سهوله، متوفر الأن علي ايفون و اندرويد
        </p>

        <GooglePlay_AppStore />
      </div>
    </div>
  );
};

export default Panner;
