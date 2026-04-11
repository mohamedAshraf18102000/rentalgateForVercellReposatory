export const getPriceWithoutTax = (priceWithTax: number): number => {
    return priceWithTax / 1.15;
};