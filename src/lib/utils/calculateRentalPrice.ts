export type PricingType =
  | "DAILY"
  | "WEEKLY"
  | "HALF_MONTHLY"
  | "MONTHLY"
  | "YEARLY";

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
      pricingType: "DAILY",
    };
  }

  let pricePerDay = 0;
  let pricingType: PricingType = "DAILY";

  if (days <= 6) {
    pricingType = "DAILY";

    const price = getEffectivePrice(dailyPrice, offerDailyPrice);
    pricePerDay = price;
  } else if (days <= 14) {
    pricingType = "WEEKLY";

    const price = getEffectivePrice(weeklyPrice, offerWeeklyPrice);
    pricePerDay = price / 7;
  } else if (days <= 29) {
    pricingType = "HALF_MONTHLY";

    const price = getEffectivePrice(halfMonthlyPrice, offerHalfMonthlyPrice);
    pricePerDay = price / 15;
  } else if (days <= 359) {
    pricingType = "MONTHLY";

    const price = getEffectivePrice(monthlyPrice, offerMonthlyPrice);
    pricePerDay = price / 30;
  } else {
    pricingType = "YEARLY";

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
