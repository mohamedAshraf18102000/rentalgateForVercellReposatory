import { redirect } from "@/i18n/routing";
import { getHomePageDetails } from "@/services/home/home.service";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

const isHomeAvailable = async () => {
  try {
    await getHomePageDetails({ skipErrorToast: true, cache: "no-store" });
    return true;
  } catch {
    return false;
  }
};

const MaintenancePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  if (await isHomeAvailable()) {
    redirect({ href: "/", locale });
  }

  return (
    <div className="min-h-screen w-full p-3 bg-red-950 text-white flex items-center justify-center text-4xl sm:text-6xl md:text-xl font-bold text-center">
      تحت التطوير
      <div>
        <Link href="/">CLICK HERE </Link>
      </div>
    </div>
  );
};

export default MaintenancePage;
