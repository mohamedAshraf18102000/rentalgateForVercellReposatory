import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createCarDetailsMetadata } from "@/lib/seo";
import { getCompanyCarsByID } from "@/services/companyCars/carById.service";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const ccbId = Number(id);
  if (Number.isNaN(ccbId)) {
    return createCarDetailsMetadata();
  }

  try {
    const data = await getCompanyCarsByID(ccbId, { skipErrorToast: true });
    return createCarDetailsMetadata(data.car?.carName);
  } catch {
    return createCarDetailsMetadata();
  }
}

export default function CarDetailsLayout({ children }: LayoutProps) {
  return children;
}
