"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

const partnersRow1 = [
  { id: 1, src: "/cars/car1.png", alt: "Partner 1" },
  { id: 2, src: "/cars/car1.png", alt: "Partner 2" },
  { id: 3, src: "/cars/car1.png", alt: "Partner 3" },
  { id: 4, src: "/cars/car1.png", alt: "Partner 4" },
  { id: 5, src: "/cars/car1.png", alt: "Partner 5" },
];

const partnersRow2 = [
  { id: 6, src: "/cars/car2.png", alt: "Partner 6" },
  { id: 7, src: "/cars/car2.png", alt: "Partner 7" },
  { id: 8, src: "/cars/car2.png", alt: "Partner 8" },
  { id: 9, src: "/cars/car2.png", alt: "Partner 9" },
  { id: 10, src: "/cars/car2.png", alt: "Partner 10" },
];

const PartnerLogo = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex items-center justify-center mx-3 md:mx-5">
    <div
      className="relative w-[160px] h-[90px] md:w-[200px] md:h-[110px] flex items-center justify-center p-3 
                    rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100
                    transition-all duration-300 ease-in-out
                    hover:scale-105 hover:shadow-lg hover:shadow-gray-200/50 hover:bg-white"
    >
      <Image
        src={src}
        alt={alt}
        width={180}
        height={100}
        className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
      />
    </div>
  </div>
);

const SuccessPartnersMerquee = () => {
  return (
    <section className="w-full h-full flex items-center justify-center">
      <div
        className="w-full flex flex-col gap-4 overflow-hidden py-2"
        dir="ltr"
      >
        {/* Row 1 — scrolls left */}
        <Marquee
          autoFill={true}
          pauseOnHover={true}
          speed={40}
          gradientColor="#ffffff"
          gradientWidth={80}
          direction="left"
        >
          {partnersRow1.map((partner) => (
            <PartnerLogo key={partner.id} src={partner.src} alt={partner.alt} />
          ))}
        </Marquee>

        {/* Row 2 — scrolls right for dynamic feel */}
        <Marquee
          autoFill={true}
          pauseOnHover={true}
          speed={30}
          gradientColor="#ffffff"
          gradientWidth={80}
          direction="right"
        >
          {partnersRow2.map((partner) => (
            <PartnerLogo key={partner.id} src={partner.src} alt={partner.alt} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default SuccessPartnersMerquee;
