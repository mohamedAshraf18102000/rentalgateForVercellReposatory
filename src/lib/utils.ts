import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatPrice(
  price: number,
  options?: {
    maxFractionDigits?: number;
    truncate?: boolean;
  }
): string {
  const { maxFractionDigits = 2, truncate = false } = options || {};

  let value = price;

  // Prevent rounding up
  if (truncate) {
    const factor = 10 ** maxFractionDigits;
    value = Math.trunc(price * factor) / factor;
  }

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });

  return formatted.replace(/\.00$/, "");
}