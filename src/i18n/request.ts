import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load all message files for the locale
  const messages = {
    common: (await import(`../../messages/${locale}/common.json`)).default,
    home: (await import(`../../messages/${locale}/home.json`)).default,
    about: (await import(`../../messages/${locale}/about.json`)).default,
    services: (await import(`../../messages/${locale}/services.json`)).default,
    contact: (await import(`../../messages/${locale}/contact.json`)).default,
    validation: (await import(`../../messages/${locale}/validation.json`)).default,
    profile: (await import(`../../messages/${locale}/profile.json`)).default,
    carDetails: (await import(`../../messages/${locale}/carDetails.json`)).default,
    auth: (await import(`../../messages/${locale}/auth.json`)).default,
    companyQuotation: (await import(`../../messages/${locale}/companyQuotation.json`)).default,
  };

  return {
    locale,
    messages,
  };
});

