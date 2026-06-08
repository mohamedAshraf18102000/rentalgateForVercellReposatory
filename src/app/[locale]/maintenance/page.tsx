import { redirect } from "@/i18n/routing";
import { getHomePageDetails } from "@/services/home/home.service";
import { setRequestLocale } from "next-intl/server";
import { MaintenanceComponent } from "./MaintenanceComponent";

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

  return <MaintenanceComponent />;
};

export default MaintenancePage;
