import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { Almarai } from "next/font/google";
import { cookies, headers } from "next/headers";
import "../globals.css";

const fontAlmarai = Almarai({
  weight: ["400", "700", "800"],
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-almarai",
});

async function getDocumentLocale() {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const segment = pathname.split("/").filter(Boolean)[0];

  if (hasLocale(routing.locales, segment)) {
    return segment;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  if (hasLocale(routing.locales, cookieLocale)) {
    return cookieLocale;
  }

  return routing.defaultLocale;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getDocumentLocale();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={fontAlmarai.variable}
    >
      <body
        style={{ fontFamily: fontAlmarai.style.fontFamily }}
        className="flex flex-col overflow-y-scroll"
      >
        {children}
      </body>
    </html>
  );
}
