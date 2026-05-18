import { routing } from "@/i18n/routing";
import { DialogProvider, Footer, Header, Toaster } from "@/ui";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Almarai, Zain } from "next/font/google";
import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { redirect } from "next/navigation";
import { ensureLocalizedPathname } from "@/util/locale-path";
import arCommonMessages from "../../../messages/ar/common.json";
import arHomeMessages from "../../../messages/ar/home.json";
import enCommonMessages from "../../../messages/en/common.json";
import enHomeMessages from "../../../messages/en/home.json";
import "../../globals.css";
import { RouteGuard } from "./(components)/RouteGuard";
import SideToChat from "../(components)/sideToChat/SideToChat";
import { CurrentLocationDialog } from "./(dialogs)/PickupDialog/CurrentLocationDialog";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import ReservationStateResetWatcher from "./(components)/ReservationStateResetWatcher";
import { TooltipProvider } from "../(components)/ui/tooltip";

// const fontZain = Zain({
//   subsets: ["arabic", "latin"],
//   weight: ["400", "200", "300", "700"],
//   display: "swap",
//   variable: "--font-zain",
// });

const fontAlmarai = Almarai({
  weight: ["400", "700", "800"],
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-almarai",
});

const metadataMessages = {
  ar: {
    common: arCommonMessages,
    home: arHomeMessages,
  },
  en: {
    common: enCommonMessages,
    home: enHomeMessages,
  },
} as const;

function getLocaleMetadata(locale: string) {
  const normalizedLocale = locale === "en" ? "en" : "ar";
  const { common, home } = metadataMessages[normalizedLocale];
  const isArabic = normalizedLocale === "ar";
  const siteName = isArabic ? "رينتال جيت" : "Rental Gate";
  const title = isArabic
    ? `${home.title || "مرحباً بك في رينتال جيت"} - ${common.companyName || "رينتال جيت"}`
    : `${home.title || "Welcome to Rental Gate"} - ${common.companyName || "Rental Gate"}`;
  const description = isArabic
    ? home.description ||
      "منصتك الموثوقة لتأجير السيارات في المملكة العربية السعودية"
    : home.description ||
      "Your trusted platform for car rental in Saudi Arabia";

  return {
    locale: normalizedLocale,
    isArabic,
    siteName,
    title,
    description,
  };
}

async function getBaseUrl() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host");

  if (host) {
    const protocol =
      headerStore.get("x-forwarded-proto") ||
      (host.includes("localhost") ? "http" : "https");

    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "https://almqam.com";
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const {
    locale: normalizedLocale,
    isArabic,
    siteName,
    title,
    description,
  } = getLocaleMetadata(locale);

  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/${normalizedLocale}`;

  return {
    metadataBase: new URL(baseUrl),
    keywords: isArabic
      ? ["تأجير سيارات", "رينتال جيت", "تأجير", "سيارات", "السعودية", "الرياض"]
      : [
          "car rental",
          "Rental Gate",
          "rental",
          "cars",
          "Saudi Arabia",
          "Riyadh",
        ],
    authors: [{ name: siteName }],
    creator: "Viganium",
    publisher: "Viganium",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: normalizedLocale === "ar" ? "ar_SA" : "en_US",
      url,
      siteName,
      title,
      description,
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/logo.png"],
      creator: "@almqam",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [{ url: "/logo-rental.png", type: "image/png" }],
      apple: [{ url: "/logo-rental.png", type: "image/png" }],
      shortcut: "/logo-rental.png",
    },
    manifest: "/manifest.json",
    verification: {
      // يمكن إضافة Google Search Console verification code هنا
      // google: 'your-verification-code',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fallback when proxy did not run: /userProfile was parsed as [locale]=userProfile
  if (!hasLocale(routing.locales, locale)) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    const preferredLocale = hasLocale(routing.locales, cookieLocale)
      ? cookieLocale
      : routing.defaultLocale;

    const headerList = await headers();
    const invokeUrl = headerList.get("x-url") ?? headerList.get("next-url");
    let pathname = `/${locale}`;
    if (invokeUrl) {
      try {
        pathname = new URL(invokeUrl).pathname;
      } catch {
        // keep fallback pathname
      }
    }

    redirect(ensureLocalizedPathname(pathname, preferredLocale));
  }

  const {
    locale: normalizedLocale,
    title,
    description,
  } = getLocaleMetadata(locale);
  const baseUrl = await getBaseUrl();
  const canonicalUrl = `${baseUrl}/${normalizedLocale}`;

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      // className={` ${fontAlmarai.variable} ${fontZain.variable}`}
      className={` ${fontAlmarai.variable}`}
    >
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en`} />

        {/* Favicon */}
        <link rel="icon" href="/logo-rental.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-rental.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        style={{ fontFamily: fontAlmarai.style.fontFamily }}
        className="flex flex-col min-h-screen"
      >
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider>
            <ReactQueryProvider>
              <DialogProvider>
                <RouteGuard />
                <ReservationStateResetWatcher />
                <CurrentLocationDialog />
                <Header />
                <SideToChat />
                <main className="max-sm:pt-[65px] flex-1">{children}</main>
                <Footer />
                <Toaster />
              </DialogProvider>
            </ReactQueryProvider>
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
