import { redirect } from "@/i18n/routing";
import { checkApiAvailability } from "@/services/health/health.service";
import { setRequestLocale } from "next-intl/server";
import { LocateMaintenancePage } from "./LocateMaintenancePage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

const MaintenancePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  if (await checkApiAvailability()) {
    redirect({ href: "/", locale });
  }

  return <LocateMaintenancePage />;
};

export default MaintenancePage;
