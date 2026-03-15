"use client";

import { Company } from "@/types/home/home";
import Image from "next/image";
import Marquee from "react-fast-marquee";

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

const SuccessPartnersMerquee = ({ partners }: { partners: Company[] }) => {
  const midPoint = Math.ceil(partners.length / 2);
  const row1 = partners.slice(0, midPoint);
  const row2 = partners.slice(midPoint);

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
          {row1.map((partner) => (
            <PartnerLogo
              key={partner.id}
              src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${partner.logo}`}
              alt={partner.name}
            />
          ))}
        </Marquee>

        <Marquee
          autoFill={true}
          pauseOnHover={true}
          speed={30}
          gradientColor="#ffffff"
          gradientWidth={80}
          direction="right"
        >
          {row2.map((partner) => (
            <PartnerLogo
              key={partner.id}
              src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${partner.logo}`}
              alt={partner.name}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default SuccessPartnersMerquee;
