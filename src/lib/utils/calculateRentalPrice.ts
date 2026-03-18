export type PricingType =
  | "daily"
  | "weekly"
  | "halfMonthly"
  | "monthly"
  | "yearly";

interface PriceInput {
  days: number;

  dailyPrice: number;
  weeklyPrice: number;
  halfMonthlyPrice: number;
  monthlyPrice: number;
  yearlyPrice: number;

  offerDailyPrice: number;
  offerWeeklyPrice: number;
  offerHalfMonthlyPrice: number;
  offerMonthlyPrice: number;
  offerYearlyPrice: number;
}

interface PriceResult {
  totalPrice: number;
  pricePerDay: number;
  pricingType: PricingType;
}

const getEffectivePrice = (price: number, offerPrice: number) => {
  return offerPrice > 0 ? offerPrice : price;
};

export const calculateRentalPrice = ({
  days,

  dailyPrice,
  weeklyPrice,
  halfMonthlyPrice,
  monthlyPrice,
  yearlyPrice,

  offerDailyPrice,
  offerWeeklyPrice,
  offerHalfMonthlyPrice,
  offerMonthlyPrice,
  offerYearlyPrice,
}: PriceInput): PriceResult => {
  if (days <= 0) {
    return {
      totalPrice: 0,
      pricePerDay: 0,
      pricingType: "daily",
    };
  }

  let pricePerDay = 0;
  let pricingType: PricingType = "daily";

  if (days <= 6) {
    pricingType = "daily";

    const price = getEffectivePrice(dailyPrice, offerDailyPrice);
    pricePerDay = price;
  } else if (days <= 14) {
    pricingType = "weekly";

    const price = getEffectivePrice(weeklyPrice, offerWeeklyPrice);
    pricePerDay = price / 7;
  } else if (days <= 29) {
    pricingType = "halfMonthly";

    const price = getEffectivePrice(halfMonthlyPrice, offerHalfMonthlyPrice);
    pricePerDay = price / 15;
  } else if (days <= 359) {
    pricingType = "monthly";

    const price = getEffectivePrice(monthlyPrice, offerMonthlyPrice);
    pricePerDay = price / 30;
  } else {
    pricingType = "yearly";

    const price = getEffectivePrice(yearlyPrice, offerYearlyPrice);
    pricePerDay = price / 360;
  }

  const totalPrice = pricePerDay * days;

  return {
    totalPrice,
    pricePerDay,
    pricingType,
  };
};
