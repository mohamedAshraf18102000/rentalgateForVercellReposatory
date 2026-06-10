import { redirect } from "@/i18n/routing";
import { getCachedBackendHealth } from "@/lib/health";
import { setRequestLocale } from "next-intl/server";
import { LocateMaintenancePage } from "./LocateMaintenancePage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

const MaintenancePage = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  // Use the shared 30 s server-side cache so that rendering this page (which
  // is force-dynamic) does not create a fresh TCP connection to the backend
  // on every request. The proxy already checked health before routing here;
  // this call will hit the warm cache in the vast majority of cases.
  const isUp = await getCachedBackendHealth();
  if (isUp) {
    redirect({ href: "/", locale });
  }

  return <LocateMaintenancePage />;
};

export default MaintenancePage;
