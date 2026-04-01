"use client";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { applyPromoCodeValueChecker } from "@/lib/utils/promoCodeValueChecker";

import { getAuthToken } from "@/util/auth";
import { useEffect, useState } from "react";

// const Page = () => {
//   const store = useBookedCarDetailsStore();
//   console.log("store", store.formData);

//   const [userToken, setUserToken] = useState<string | null>(null);

//   useEffect(() => {
//     const token = getAuthToken();
//     setUserToken(token);
//   }, []);

//   return (
//     <WrapperContainer
//       exceedNav
//       className="p-10 flex flex-col gap-8 max-w-4xl mx-auto"
//     >
//       <h1 className="text-3xl font-bold text-gray-800">Token Debug Page</h1>

//       <section className="flex flex-col gap-4">
//         <h2 className="text-xl font-semibold text-blue-600">
//           User Authentication Token
//         </h2>
//         <div className="p-6 bg-blue-50 rounded-xl break-all border border-blue-200 shadow-sm">
//           {userToken ? (
//             <code className="text-sm font-mono text-blue-900 selection:bg-blue-200">
//               {userToken}
//             </code>
//           ) : (
//             <span className="text-amber-600 italic">
//               No user token found in cookies (Not logged in)
//             </span>
//           )}
//         </div>
//       </section>
//     </WrapperContainer>
//   );
// };

// export default Page;

const page = () => {
  const formData = useBookedCarDetailsStore((s) => s.formData);
  console.log("formData", formData);

  console.log("formData.price", formData.price);
  console.log("formData.points.value", formData.points?.value);
  console.log("formData.promoCode", formData.promoData?.code);

  console.log(
    "final amount to pay",
    (formData?.price || 0) -
      (formData?.points?.value || 0) -
      (formData?.promoData?.discountValue || 0),
  );

  const finalPrice = applyPromoCodeValueChecker(960, 2, 10);

  return (
    <WrapperContainer exceedNav>
      {formData.price}
      <p>{finalPrice}</p>
    </WrapperContainer>
  );
};

export default page;
