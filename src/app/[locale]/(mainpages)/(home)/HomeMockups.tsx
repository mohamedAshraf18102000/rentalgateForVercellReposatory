import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import Link from "next/link";

function HomeMockups() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="container-custom pt-[30px]">
      <div className="relative">
        {/* Background Image - Hidden on mobile, shown on desktop */}
        <Image
          src="/shared/bgApp2.png"
          alt="Phone"
          width={1000}
          height={757}
          quality={100}
          className="hidden md:block w-full h-auto object-contain"
          priority
        />

        {/* Content Overlay */}
        <div className="relative md:absolute md:top-0 md:left-0 md:right-0 md:w-full md:h-full">
          {/* Mobile Layout - Stacked */}
          <div className="md:hidden flex flex-col gap-6 px-4 py-8">
            {/* Phone Mockup - First on mobile */}
            <div className="flex justify-center">
              <div className="drop-shadow-2xl w-[200px] sm:w-[240px]">
                <Image
                  src="/shared/Mockup.png"
                  alt="App Mockup"
                  width={350}
                  height={757}
                  quality={100}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            {/* Text and Buttons - Second on mobile */}
            <div className="flex flex-col justify-center items-center text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-tight px-2">
                {t("appDownload")}
              </h2>

              <div className="flex gap-3 justify-center">
                <Link
                  href={""}
                  target="_blank"
                  className="block w-[140px] sm:w-[160px] h-[44px] sm:h-[52px] hover:scale-105 transition-transform"
                >
                  <Image
                    src="/shared/Google.png"
                    alt="Get it on Google Play"
                    width={180}
                    height={60}
                    className="w-full h-full object-contain"
                  />
                </Link>
                <Link
                  href={""}
                  target="_blank"
                  className="block w-[140px] sm:w-[160px] h-[44px] sm:h-[52px] hover:scale-105 transition-transform"
                >
                  <Image
                    src="/shared/Apple.png"
                    alt="Download on the App Store"
                    width={180}
                    height={60}
                    className="w-full h-full object-contain"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden md:grid grid-cols-12 gap-8 px-8 py-10 h-full items-center">
            {/* Text and Buttons - 7 columns */}
            <div
              className={cn(
                "col-span-7 flex flex-col justify-center items-center text-center",
                isRTL ? "md:text-right" : "md:text-left",
              )}
            >
              <h2
                className={cn(
                  "text-4xl lg:text-5xl xl:text-[60px] font-bold mb-8 leading-20 text-center",
                )}
              >
                {t("appDownload")}
              </h2>

              <div className="flex gap-4 justify-center md:justify-start">
                <Link
                  href="#"
                  className="block w-[160px] lg:w-[180px] h-[52px] lg:h-[60px] hover:scale-105 transition-transform"
                >
                  <Image
                    src="/shared/Google.png"
                    alt="Get it on Google Play"
                    width={180}
                    height={60}
                    className="w-full h-full object-contain"
                  />
                </Link>
                <Link
                  href="#"
                  className="block w-[160px] lg:w-[180px] h-[52px] lg:h-[60px] hover:scale-105 transition-transform"
                >
                  <Image
                    src="/shared/Apple.png"
                    alt="Download on the App Store"
                    width={180}
                    height={60}
                    className="w-full h-full object-contain"
                  />
                </Link>
              </div>
            </div>

            {/* Phone Mockup - 5 columns */}
            <div className="col-span-5 flex justify-center md:justify-center">
              <div className="drop-shadow-2xl w-[320px] lg:w-[350px] pointer-events-none select-none!">
                <Image
                  src="/shared/Mockup.png"
                  alt="App Mockup"
                  width={350}
                  height={757}
                  quality={100}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeMockups;
