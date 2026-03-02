/**
 * Toast Handler Utility
 * Helper functions to show API messages in Sonner toast using translations
 */

import { toast } from 'sonner';

/**
 * Translation function type
 */
type TranslationFunction = (key: string) => string;

/**
 * Show API message in toast based on message type
 * @param message - Message from API (e.g., "NO_CAR_AVAILABLE", "SUCCESS", etc.)
 * @param t - Translation function from useTranslations('validation.AUTH_ERRORS')
 * @param defaultMessage - Default message if translation not found
 */
export const showApiMessage = (
  message: string,
  t: TranslationFunction,
  defaultMessage?: string
): void => {
  // Check if message is SUCCESS
  if (message === 'SUCCESS' || message.toUpperCase() === 'SUCCESS') {
    const translatedMessage = t('SUCCESS') || defaultMessage || 'تم بنجاح';
    toast.success(translatedMessage);
    return;
  }

  // Try to get translation for the message
  const translatedMessage = t(message as any) || defaultMessage || message;

  // Determine toast type based on message content
  // Error messages (most common)
  if (
    message.includes('NOT_FOUND') ||
    message.includes('NOT_AVAILABLE') ||
    message.includes('FAILED') ||
    message.includes('ERROR') ||
    message.includes('INVALID') ||
    message.includes('NOT_ALLOWED') ||
    message.includes('EXCEED') ||
    message.includes('NOT_EXISTS') ||
    message.includes('NOT_ACTIVE') ||
    message.includes('EXPIRED')
  ) {
    toast.error(translatedMessage);
    return;
  }

  // Warning messages
  if (
    message.includes('WARNING') ||
    message.includes('CANNOT') ||
    message.includes('MUST')
  ) {
    toast.warning(translatedMessage);
    return;
  }

  // Info messages
  if (message.includes('INFO') || message.includes('CHECK')) {
    toast.info(translatedMessage);
    return;
  }

  // Default to error for unknown messages
  toast.error(translatedMessage);
};

/**
 * Show success message
 */
export const showSuccess = (
  message: string,
  t: TranslationFunction,
  defaultMessage?: string
): void => {
  const translatedMessage = t(message as any) || defaultMessage || message;
  toast.success(translatedMessage);
};

/**
 * Show error message
 */
export const showError = (
  message: string,
  t: TranslationFunction,
  defaultMessage?: string
): void => {
  const translatedMessage = t(message as any) || defaultMessage || message;
  toast.error(translatedMessage);
};

/**
 * Show warning message
 */
export const showWarning = (
  message: string,
  t: TranslationFunction,
  defaultMessage?: string
): void => {
  const translatedMessage = t(message as any) || defaultMessage || message;
  toast.warning(translatedMessage);
};

/**
 * Show info message
 */
export const showInfo = (
  message: string,
  t: TranslationFunction,
  defaultMessage?: string
): void => {
  const translatedMessage = t(message as any) || defaultMessage || message;
  toast.info(translatedMessage);
};

