import GooglePlay_AppStore from "@/app/(components)/getOnGooglePlay_AppStore/GooglePlay_AppStore";

const Panner = () => {
  return (
    <div className="mt-10 flex min-h-[360px] w-full flex-col justify-center rounded-2xl border-2 border-white bg-[url(/Panners/CarDetails/panner.png)] bg-cover bg-center bg-no-repeat p-5 sm:min-h-[460px] sm:p-8 lg:min-h-[600px] lg:p-10">
      <div className="w-full md:w-2/3 lg:w-1/3">
        <h4 className="text-2xl font-bold sm:text-[28px]">
          أستمتع بتجربة تأجير راقية لا تُضاهى
        </h4>
        <p className="mt-4 text-base sm:text-lg lg:text-[20px]">
          مع تطبيق <span className="font-bold"> "رينتال جيت"</span> سيارتك
          ستجدها في موقعك بكل سهوله، متوفر الأن علي ايفون و اندرويد
        </p>

        <GooglePlay_AppStore />
      </div>
    </div>
  );
};

export default Panner;
