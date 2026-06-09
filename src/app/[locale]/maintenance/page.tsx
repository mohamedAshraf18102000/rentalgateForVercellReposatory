import { redirect } from "@/i18n/routing";
import { checkBackendHealth } from "@/lib/health";
import { setRequestLocale } from "next-intl/server";
import { LocateMaintenancePage } from "./LocateMaintenancePage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

const MaintenancePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const { isUp } = await checkBackendHealth();
  if (isUp) {
    redirect({ href: "/", locale });
  }

  return <LocateMaintenancePage />;
};

export default MaintenancePage;
