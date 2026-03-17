"use client";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { useLocale } from "next-intl";

const Page = () => {
  const locale = useLocale();

  return (
    <WrapperContainer exceedNav>{locale === "ar" ? "ع" : "E"}</WrapperContainer>
  );
};

export default Page;

// const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
//   const { locale } = await params;

//   return (
//     <WrapperContainer exceedNav>
//       {locale === "ar" ? "ع" : "E"}
//     </WrapperContainer>
//   );
// };

// export default Page;
