import { getServerDocumentLocale } from "@/util/locale-path";
import { fontAlmarai } from "@/lib/fonts";
import "../globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerDocumentLocale();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={fontAlmarai.variable}
      suppressHydrationWarning
    >
      <body
        className={`${fontAlmarai.className} flex flex-col overflow-y-scroll`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
