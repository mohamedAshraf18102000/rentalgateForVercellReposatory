import { routing } from "@/i18n/routing";
import { DialogProvider, Footer, Header, Toaster } from "@/ui";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Almarai, Zain } from "next/font/google";
import { notFound } from "next/navigation";
import "../../globals.css";
import { RouteGuard } from "./(components)/RouteGuard";
import SideToChat from "../(components)/sideToChat/SideToChat";
import { CurrentLocationDialog } from "./(dialogs)/PickupDialog/CurrentLocationDialog";
import ReactQueryProvider from "@/provider/ReactQueryProvider";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const tCommon = messages.common as Record<string, string>;
  const tHome = messages.home as Record<string, string>;

  const isArabic = locale === "ar";
  const siteName = isArabic ? "رينتال جيت" : "Rental Gate";
  const title = isArabic
    ? `${tHome.title || "مرحباً بك في رينتال جيت"} - ${tCommon.companyName || "رينتال جيت"}`
    : `${tHome.title || "Welcome to Rental Gate"} - ${tCommon.companyName || "Rental Gate"}`;
  const description = isArabic
    ? tHome.description ||
      "منصتك الموثوقة لتأجير السيارات في المملكة العربية السعودية"
    : tHome.description ||
      "Your trusted platform for car rental in Saudi Arabia";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://almqam.com";
  const url = `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
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
      locale: locale === "ar" ? "ar_SA" : "en_US",
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
    alternates: {
      canonical: url,
      languages: {
        ar: `${baseUrl}/ar`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/en`,
      },
    },
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

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

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
          <DialogProvider>
            <RouteGuard />
            <CurrentLocationDialog />
            <Header />
            <SideToChat />
            <main className="max-sm:pt-[65px] flex-1">
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </main>
            <Footer />
            <Toaster />
          </DialogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
