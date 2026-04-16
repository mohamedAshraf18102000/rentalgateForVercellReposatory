"use client";

import { Company } from "@/types/home/home";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const PartnerLogo = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex items-center justify-center mx-1 md:mx-1">
    <div
      className="relative h-[120px] md:h-[150px] flex items-center justify-center p-5 overflow-hidden
                    bg-white/60 backdrop-blur-sm border border-gray-200
                    transition-all duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl  hover:shadow-gray-200/50 hover:bg-white"
      style={{
        aspectRatio: "0.85 / 0.866",
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
      }}
    >
      <div className="w-[90px] h-[90px] md:w-[90px] md:h-[90px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
        <Image
          src={src}
          alt={alt}
          width={120}
          height={120}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out rounded-full border-2 border-Grey200"
        />
      </div>
    </div>
  </div>
);

const SuccessPartnersMerquee = ({ partners }: { partners: Company[] }) => {
  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="w-full overflow-hidden py-2" dir="ltr">
        <Marquee
          className="overflow-hidden h-[200px]"
          autoFill={true}
          pauseOnHover={true}
          speed={50}
          gradientColor="#ffffff"
          gradientWidth={80}
          direction="left"
        >
          {partners.map((partner) => (
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
