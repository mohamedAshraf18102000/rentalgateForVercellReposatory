/**
 * Utility functions for formatting data
 */

/**
 * Format date and time for API
 * Returns format: "2025-12-25T12:21:00.000"
 */
export const formatDateTime = (date: Date | null, time: string): string | null => {
  if (!date) return null;

  const [hours, minutes] = time.split(':');
  const dateTime = new Date(date);
  dateTime.setHours(parseInt(hours || '0', 10));
  dateTime.setMinutes(parseInt(minutes || '0', 10));
  dateTime.setSeconds(0);
  dateTime.setMilliseconds(0);

  // Format as: "2025-12-25T12:21:00.000" (without Z)
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, '0');
  const day = String(dateTime.getDate()).padStart(2, '0');
  const hour = String(dateTime.getHours()).padStart(2, '0');
  const minute = String(dateTime.getMinutes()).padStart(2, '0');
  const second = String(dateTime.getSeconds()).padStart(2, '0');
  const millisecond = String(dateTime.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
};

/**
 * Format price number to 2 decimal places
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Format number to 2 decimal places
 */
export const formatNumber = (num: number): string => {
  return num.toFixed(2);
};

