"use client";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { calculateRentalPrice } from "@/lib/utils/calculateRentalPrice";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

const Page = () => {
  const { filters } = useUserPreferedFiltersStore();
  const result = calculateRentalPrice({
    days: 12,

    dailyPrice: 100,
    weeklyPrice: 110,
    halfMonthlyPrice: 150,
    monthlyPrice: 200,
    yearlyPrice: 300,

    offerDailyPrice: 0,
    offerWeeklyPrice: 50,
    offerHalfMonthlyPrice: 0,
    offerMonthlyPrice: 0,
    offerYearlyPrice: 0,
  });

  console.log("Total Price:", result.totalPrice);
  console.log("Price Per Day:", result.pricePerDay);
  console.log("Pricing Type:", result.pricingType);

  return (
    <WrapperContainer exceedNav>
      <div>
        <p>Total Price: {result.totalPrice}</p>
        <p>Price Per Day: {result.pricePerDay}</p>
        <p>Pricing Type: {result.pricingType}</p>
      </div>
      <p>--------------------------------------------------</p>

      <p>{filters.fromDate}</p>
      <p>{filters.toDate}</p>
    </WrapperContainer>
  );
};

export default Page;
