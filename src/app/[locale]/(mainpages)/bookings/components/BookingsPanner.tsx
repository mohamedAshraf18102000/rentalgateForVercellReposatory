import Image from "next/image";

const BookingsPanner = () => {
  return (
    <section className="rounded-2xl w-full bg-[url(/Panners/bookings/bookingPanner.png)] bg-center bg-no-repeat bg-cover p-10 flex justify-between items-center">
      <div className="text-white w-1/2">
        <h1 className="font-bold text-3xl">
          أستمتع بتجربة تأجير راقية لا تُضاهى
        </h1>
        <p className="text-[20px] mt-4 w-3/4">
          مع تطبيق <span className="font-bold">"رينتال جيت"</span> سيارتك ستجدها
          في موقعك بكل سهوله، متوفر الأن علي ايفون و اندرويد
        </p>
      </div>

      <div className="text-white w-1/4 bg-red-800">
        <div className="flex gap-3 justify-center">
          <a
            href="#"
            target="_blank"
            className="block w-[140px] sm:w-[160px] h-[44px] sm:h-[52px] hover:scale-105 transition-transform"
          >
            <Image
              src="/shared/AppleWhite.png"
              alt="Download on the App Store"
              width={180}
              height={60}
              className="w-full h-full object-contain"
            />
          </a>
          <a
            href="#"
            target="_blank"
            className="block w-[140px] sm:w-[160px] h-[44px] sm:h-[52px] hover:scale-105 transition-transform"
          >
            <Image
              src="/shared/GoogleWhite.png"
              alt="Get it on Google Play"
              width={180}
              height={60}
              className="w-full h-full object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BookingsPanner;
