/**
 * Formats a price to a human-readable string with up to 2 decimal places.
 * If the price is an integer, it doesn't show decimal places.
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return "0";
  
  // Round to 2 decimal places for precision
  const roundedPrice = Math.round((price + Number.EPSILON) * 100) / 100;
  
  return roundedPrice.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
