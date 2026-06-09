import { routing } from "@/i18n/routing";

const maintenancePathPattern = new RegExp(
  `^/(${routing.locales.join("|")})/maintenance/?$`,
);

export function isMaintenancePath(pathname: string): boolean {
  return maintenancePathPattern.test(pathname);
}
