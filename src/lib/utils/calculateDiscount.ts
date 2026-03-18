interface DiscountInput {
  originalPrice: number;
  offerPrice: number;
}

interface DiscountResult {
  discountAmount: number;
  discountPercentage: number;
}

export const calculateDiscount = ({
  originalPrice,
  offerPrice,
}: DiscountInput): DiscountResult => {
  if (offerPrice <= 0 || offerPrice >= originalPrice) {
    return {
      discountAmount: 0,
      discountPercentage: 0,
    };
  }

  const discountAmount = originalPrice - offerPrice;

  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  return {
    discountAmount,
    discountPercentage,
  };
};
