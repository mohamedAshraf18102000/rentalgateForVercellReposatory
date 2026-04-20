// "use client";

// import { Company } from "@/types/home/home";
// import Image from "next/image";
// import Marquee from "react-fast-marquee";

// const PartnerLogo = ({ src, alt }: { src: string; alt: string }) => (
//   <div className="flex items-center justify-center mx-1 md:mx-1">
//     <div
//       className="relative h-[120px] md:h-[150px] flex items-center justify-center p-5 overflow-hidden
//                     bg-white/60 backdrop-blur-sm border border-gray-200
//                     transition-all duration-300 ease-in-out
//                     hover:scale-105 hover:shadow-2xl  hover:shadow-gray-200/50 hover:bg-white"
//       style={{
//         aspectRatio: "0.85 / 0.866",
//         clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
//       }}
//     >
//       <div className="w-[90px] h-[90px] md:w-[90px] md:h-[90px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
//         <Image
//           src={src}
//           alt={alt}
//           width={120}
//           height={120}
//           className="w-full h-full object-cover transition-transform duration-300 ease-in-out rounded-full border-2 border-Grey200"
//         />
//       </div>
//     </div>
//   </div>
// );

// const SuccessPartnersMerquee = ({ partners }: { partners: Company[] }) => {
//   return (
//     <section className="w-full h-full flex items-center justify-center ">
//       <div className="w-full overflow-hidden py-2 relative" dir="ltr">
//         <Marquee
//           className="overflow-hidden"
//           autoFill={true}
//           pauseOnHover={false}
//           speed={10}
//           gradientColor="#ffffff"
//           gradientWidth={80}
//           direction="left"
//         >
//           {partners.map((partner) => (
//             <PartnerLogo
//               key={partner.id}
//               src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${partner.logo}`}
//               alt={partner.name}
//             />
//           ))}
//         </Marquee>
//       </div>

//     </section>
//   );
// };

// export default SuccessPartnersMerquee;

"use client";

import { Company } from "@/types/home/home";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const HEX_SHADES = ["#FFFFFF"];

const HexCell = ({
  src,
  alt,
  colorIdx,
}: {
  src: string;
  alt: string;
  colorIdx: number;
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 116,
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 110,
        height: 126,
        clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
        background: HEX_SHADES[colorIdx % HEX_SHADES.length],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.25s",
        cursor: "pointer",
      }}
    >
      <div
        className="shadow-xl! border-2"
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: "#fff",
          overflow: "hidden",
          border: "2.5px solid rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={70}
          height={70}
          className="w-full h-full object-fill rounded-full hover:scale-105 transition-all duration-300 ease-in-out"
        />
      </div>
    </div>
  </div>
);

const SuccessPartnersMerquee = ({ partners }: { partners: Company[] }) => {
  const half = Math.floor(partners.length / 2);
  const row2 = [...partners.slice(half), ...partners.slice(0, half)];

  return (
    <section className="w-full overflow-hidden py-4 relative h-full" dir="ltr">
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none rounded-none"
        style={{
          background: "linear-gradient(to top, #F5F5F5/50%, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none rounded-none"
        style={{
          background: "linear-gradient(to left, #F5F5F5/50%, transparent)",
        }}
      />

      <div className="flex flex-col relative" style={{ gap: 0 }}>
        {[
          { list: partners, offset: false },
          { list: row2, offset: true },
        ].map((row, ri) => (
          <div
            className="h-full "
            key={ri}
            style={{ marginBottom: ri === 0 ? -25 : 0 }}
          >
            <div
              className="absolute"
              style={{
                width: "100%",
                height: "450px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(252, 165, 165, 0.55) 0%, rgba(254, 202, 202, 0.35) 35%, rgba(255, 228, 228, 0.15) 60%, transparent 100%)",
                filter: "blur(18px)",
                borderRadius: "50%",
              }}
            />
            <Marquee
              autoFill
              pauseOnHover={false}
              speed={30}
              gradientWidth={0}
              direction="left"
              style={{
                transform: row.offset ? "translateX(58px)" : undefined,
                overflow: "visible",
              }}
            >
              {row.list.map((partner, i) => (
                <HexCell
                  key={partner.id}
                  src={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}/${partner.logo}`}
                  alt={partner.name}
                  colorIdx={ri * 3 + i}
                />
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuccessPartnersMerquee;
