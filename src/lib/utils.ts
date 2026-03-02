import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * تنسيق السعر بفواصل الآلاف مع إزالة .00 من الأرقام الصحيحة
 * @param price - السعر المراد تنسيقه
 * @returns السعر المنسق (مثال: 1,000 أو 150,454.50)
 */
export function formatPrice(price: number): string {
  const formatted = price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  // إزالة .00 من نهاية الأرقام الصحيحة
  return formatted.replace(/\.00$/, '');
}
