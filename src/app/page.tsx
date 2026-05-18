import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

type AppLocale = (typeof routing.locales)[number];

function resolveLocale(cookieLocale: string | undefined): AppLocale {
  if (
    cookieLocale &&
    routing.locales.includes(cookieLocale as AppLocale)
  ) {
    return cookieLocale as AppLocale;
  }
  return routing.defaultLocale;
}

/** Fallback when proxy does not run: send `/` to a localized home route. */
export default async function RootPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("NEXT_LOCALE")?.value);
  redirect(`/${locale}`);
}
