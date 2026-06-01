import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import getOfferTypeMessage from "@/app/(components)/customCards/CarsCard/utils/offerTypes";
import { createOfferedCarsMetadata } from "@/lib/seo";
import { getOfferedCars } from "@/services/companyCars/offeredCars.service";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const offerId = Number(id);
  if (Number.isNaN(offerId)) {
    return createOfferedCarsMetadata();
  }

  try {
    const data = await getOfferedCars(offerId, { skipErrorToast: true });
    const offerLabel = getOfferTypeMessage({
      offerType: data.offerType,
      offerValue: data.offerValue,
      locale,
    });

    return createOfferedCarsMetadata(
      offerLabel || undefined,
      data.cars?.length,
    );
  } catch {
    return createOfferedCarsMetadata();
  }
}

export default function OfferedCarsLayout({ children }: LayoutProps) {
  return children;
}
