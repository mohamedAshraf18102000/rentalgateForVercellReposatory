import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ar', 'en'],

  // Used when no locale matches
  defaultLocale: 'ar',

  // The prefix strategy for the locale in the URL
  localePrefix: 'always',

  // Disable browser Accept-Language detection so that
  // the defaultLocale ('ar') is used when no cookie/prefix is present.
  // Without this, browsers with English as the primary language
  // would always be redirected to /en instead of /ar.
  localeDetection: false,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

