// // "use client";
// // import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
// // import { useCalculateQuotePrice } from "@/hooks/api/useCalculateQuotePrice";
// // import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
// // import { Button } from "@base-ui/react";
// // import { format } from "date-fns";

// // const page = () => {
// //   const formData = useBookedCarDetailsStore((s) => s.formData);
// //   const { mutate, data: mutateRes } = useCalculateQuotePrice();
// //   console.log(formData);

// //   console.log("mutateRes", mutateRes?.startDate);

// //   const checkedDate = mutateRes?.startDate;

// //   const formattedDate = checkedDate
// //     ? format(
// //         new Date(
// //           new Date(checkedDate).getTime() -
// //             new Date(checkedDate).getTimezoneOffset() * 60000,
// //         ),
// //         "dd/MM/yyyy HH:mm",
// //       )
// //     : "";

// //   const toSaudiTimeString = (date: string | Date) => {
// //     const d = new Date(date);

// //     // نجيب الوقت في توقيت السعودية
// //     const utc = d.getTime() + d.getTimezoneOffset() * 60000; // نحول للـ UTC
// //     const saudiOffset = 3 * 60 * 60 * 1000; // +3 ساعات
// //     const saudiTime = new Date(utc + saudiOffset);

// //     return saudiTime.toISOString().split(".")[0]; // YYYY-MM-DDTHH:mm:ss
// //   };

// //   const handleCalculateQuotePrice = () => {
// //     // mutate({
// //     //   startDate: formData.fromDate,
// //     //   endDate: formData.toDate,
// //     //   companyCarBranchId: formData.carDetails?.ccbId,
// //     //   promoCode: formData.promoData?.code,
// //     //   deliver: {
// //     //     pickupType: formData.pickupType,
// //     //     latitude: formData.pickupLat,
// //     //     longitude: formData.pickupLong,
// //     //   },
// //     // });
// //     console.log({
// //       companyCarBranchId: formData.carDetails?.ccbId,
// //       startDate: formData.fromDate,
// //       endDate: formData.toDate,
// //       promoCode: formData.promoData?.code,
// //       referralCode: formData.referalcode,
// //       deliver: {
// //         pickupType: formData.pickupType,
// //         latitude: formData.pickupLat,
// //         longitude: formData.pickupLong,
// //       },
// //       receive: {
// //         pickupType: formData.returnType,
// //         latitude: formData.returnLat,
// //         longitude: formData.returnLong,
// //       },
// //       servicesIds: formData.services,
// //       driver: formData.driver && {
// //         driverRequested: !!formData.driver,
// //         outOfCity: formData.driver?.type === "out",
// //         driverHours: formData.driver?.hours,
// //         driverDays: formData.driver?.days,
// //       },
// //       countryId: 1,
// //       points: {
// //         type: formData.points?.type,
// //         pointsPkId: formData.points?.pointsPkId,
// //       },
// //     });
// //     mutate({
// //       companyCarBranchId: formData.carDetails?.ccbId ?? null,

// //       startDate: formData.fromDate
// //         ? toSaudiTimeString(formData.fromDate)
// //         : null,

// //       endDate: formData.toDate ? toSaudiTimeString(formData.toDate) : null,

// //       promoCode: formData.promoData?.code ?? null,
// //       referralCode: formData.referalcode ?? null,

// //       deliver: {
// //         type: formData.pickupType ?? null,
// //         ...(formData.pickupType === "TRAIN_STATION" && {
// //           trainId: formData.pickupTrainId,
// //         }),
// //         ...(formData.pickupType === "AIRPORT" && {
// //           airportId: formData.pickupAirportId,
// //         }),
// //         ...(formData.pickupType === "MY_LOCATION" && {
// //           latitude: formData.pickupLat ?? null,
// //           longitude: formData.pickupLong ?? null,
// //           addressId: formData.pickupId ? Number(formData.pickupId) : null,
// //         }),
// //       },

// //       receive: {
// //         type: formData.returnType ?? null,
// //         ...(formData.returnType === "TRAIN_STATION" && {
// //           trainId: formData.returnTrainId,
// //         }),
// //         ...(formData.returnType === "AIRPORT" && {
// //           airportId: formData.returnAirportId,
// //         }),
// //         ...(formData.returnType === "MY_LOCATION" && {
// //           latitude: formData.returnLat ?? null,
// //           longitude: formData.returnLong ?? null,
// //           addressId: formData.carReturnLocationId
// //             ? Number(formData.carReturnLocationId)
// //             : null,
// //         }),
// //       },

// //       servicesIds:
// //         formData.services && formData.services.length > 0
// //           ? formData.services
// //           : null,

// //       driver: {
// //         driverRequested: !!formData.driver,
// //         outOfCity: formData.driver?.type === "out",
// //         driverHours: formData.driver?.hours ?? null,
// //         driverDays: formData.driver?.days ?? null,
// //       },

// //       points: formData.points?.type
// //         ? {
// //             type: formData.points.type,
// //             pointsPkId: formData.points.pointsPkId ?? null,
// //           }
// //         : null,

// //       extraKm: {
// //         extraKmApplied: false,
// //         extraKmType: "UNLIMITED",
// //         extraKmQuotaId: null,
// //       },
// //     });
// //   };

// //   const handlelogformdata = () => {
// //     console.log(formData);
// //   };

// //   return (
// //     <WrapperContainer exceedNav className="bg-red-950 text-white h-[500px]">
// //       <div className="">page</div>
// //       <Button onClick={handleCalculateQuotePrice}>Calculate Quote Price</Button>
// //       <br />
// //       <br />
// //       <br />
// //       <br />
// //       <br />

// //       <p className="bg-red-200 p-3 w-full">{formattedDate}</p>
// //       <Button onClick={handlelogformdata}>log form data</Button>
// //     </WrapperContainer>
// //   );
// // };

// // export default page;

// "use client";
// import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
// import { useCalculateQuotePrice } from "@/hooks/api/useCalculateQuotePrice";
// import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
// import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";
// import { Button } from "@base-ui/react";
// import { format } from "date-fns";
// import { buildReservationPayload } from "../(mainpages)/reservation/utils/buildReservationPayload";
// import { Separator } from "@/app/(components)/ui/separator";
// import ReservationDetailsSkeleton from "../(mainpages)/reservation/components/reservationDrawer/components/ReservationDetailsSkeleton";
// import { useBookingTerms } from "@/hooks/api/booking/useBookingTerms";

// const page = () => {
//   const formData = useBookedCarDetailsStore((s) => s.formData);
//   const { mutate, data: mutateRes } = useCalculateQuotePrice();

//   const checkedDate = mutateRes?.startDate;
//   const formattedDate = checkedDate
//     ? format(new Date(checkedDate), "dd/MM/yyyy HH:mm")
//     : "";

//   const handleCalculateQuotePrice = () => {
//     mutate(payload);
//   };

//   const payload = buildReservationPayload(formData);
//   const handlelogformdata = () => {
//     console.log(formData);
//   };

//   const { data: bookingTermsQuery } = useBookingTerms();
//   console.log("bookingTermsQuery", bookingTermsQuery);

//   return (
//     <>
//       {/* <WrapperContainer exceedNav className="bg-red-950 text-white h-[500px]">
//         <div className="">page</div>
//         <Button onClick={handleCalculateQuotePrice}>
//           Calculate Quote Price
//         </Button>
//         <br />

//         <p className="bg-red-200 p-3 w-full">{formattedDate}</p>
//         <Button onClick={handlelogformdata}>log form data</Button>

//         <div className="mt-5">
//           <ReservationDetailsSkeleton />
//         </div>
//       </WrapperContainer>

//       <Separator /> */}
//     </>
//   );
// };

// export default page;

"use client";

import Image from "next/image";
import SuccessPartnersMerquee from "@/app/(components)/home/SuccessPartnersMerquee";
import { Company } from "@/types/home/home";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import PartnersIcon from "@/constants/icons/PartnersIcon";

const page = ({ companiesData }: { companiesData: Company[] }) => {
  const displayPartners = companiesData || [];

  return (
    <WrapperContainer className="flex flex-col lg:flex-row gap-6 lg:gap-10 h-auto lg:h-72 my-10 px-4 md:px-0 mt-50">
      <div className="w-full lg:w-1/3 min-h-[220px] lg:h-full relative rounded-2xl overflow-hidden shadow-xl">
        <Image
          src="/successPartners/frame1.png"
          alt="frame1"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 z-40 text-white p-6 md:p-8 flex flex-col justify-center items-start">
          <div className="flex items-center gap-3">
            <PartnersIcon />
            <h5 className="font-extrabold text-2xl md:text-3xl lg:text-4xl">
              شركائنا في النجاح
            </h5>
          </div>
          <p className="text-sm md:text-base lg:text-lg w-full md:w-3/4 mt-3 opacity-90 leading-relaxed">
            نجاحنا لا يكتمل إلا بشركائنا الذين نعتز بثقتهم وتعاونهم
          </p>
        </div>
      </div>
      <div className="w-full lg:w-2/3 h-[220px] lg:h-full relative rounded-2xl overflow-hidden bg-gray-50/50">
        <SuccessPartnersMerquee partners={displayPartners} />
      </div>
    </WrapperContainer>
  );
};

export default page;
