import Image from "next/image";
import { getTranslations } from "next-intl/server";

const BookingsPanner = async () => {
  const t = await getTranslations("home");

  return (
    <section className="flex w-full min-h-48 flex-col items-stretch justify-center gap-6 rounded-2xl bg-[url(/Panners/bookings/bookingPanner.png)] bg-cover bg-center bg-no-repeat p-4 sm:min-h-56 sm:gap-8 sm:p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
      <div className="w-full text-white lg:w-1/2">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
          {t("bookings.panner.title")}
        </h1>
        <p className="mt-3 max-w-none text-base leading-relaxed sm:mt-4 sm:text-lg md:text-xl lg:w-3/4">
          {t("bookings.panner.description")}
        </p>
      </div>

      <div className="w-full text-white lg:w-auto lg:shrink-0">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-end">
          <a
            href="#"
            target="_blank"
            className="block w-[140px] sm:w-[160px] h-[44px] sm:h-[52px] hover:scale-105 transition-transform"
          >
            <Image
              src="/shared/AppleWhite.png"
              alt={t("bookings.panner.appleAlt")}
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
              alt={t("bookings.panner.googleAlt")}
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
