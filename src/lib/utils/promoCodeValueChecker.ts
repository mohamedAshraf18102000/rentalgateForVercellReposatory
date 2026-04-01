export const applyPromoCodeValueChecker = (
  value: number,
  type: number,
  discountValue: number,
): number => {
  if (type === 1) {
    const discount = (value * discountValue) / 100;
    return value - discount;
  }

  if (type === 2) {
    return value - discountValue;
  }

  return value;
};
