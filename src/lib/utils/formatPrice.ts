/**
 * Formats a price to a human-readable string with exactly 2 decimal places.
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return "0.00";

  // Round to 2 decimal places for precision
  const roundedPrice = Math.round((price + Number.EPSILON) * 100) / 100;

  return roundedPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatRatingValue = (num: number): number => {
  return Math.ceil(num * 10) / 10;
};