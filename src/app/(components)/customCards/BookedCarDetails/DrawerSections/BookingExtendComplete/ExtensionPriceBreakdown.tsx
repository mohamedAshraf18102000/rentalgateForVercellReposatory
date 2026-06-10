import ReservationFinalDetailsItem from "@/app/[locale]/(mainpages)/reservation/components/reservationDrawer/components/ReservationFinalDetailsItem";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";
import { useTranslations } from "next-intl";

type ExtensionPriceBreakdownProps = {
  data: ReservationDetailsResponse;
  isCalculating?: boolean;
};

const ExtensionPriceBreakdown = ({
  data,
  isCalculating,
}: ExtensionPriceBreakdownProps) => {
  const t = useTranslations("carDetails");

  return (
    <div className="flex flex-col gap-6">
      <ReservationFinalDetailsItem
        itemHeader={t("reservation.finalDetails.rentalDurationCostHeader")}
        items={[
          {
            label: t("reservation.finalDetails.subtotalBeforeTaxLabel"),
            isCalculating,
            value: formatPrice(data.basePrice),
          },
        ]}
      />

      <ReservationFinalDetailsItem
        itemHeader={t("reservation.finalDetails.additionalServicesCostHeader")}
        items={[
          {
            isAvailable: data.invoiceFee !== 0,
            label: t("reservation.finalDetails.rentalAgreementFeeLabel"),
            isCalculating,
            value: formatPrice(data.invoiceFee),
          },
          {
            isAvailable: data.servicesPrice !== 0,
            label: t("reservation.finalDetails.additionalServicesLabel"),
            isCalculating,
            value: formatPrice(data.servicesPrice),
          },
          {
            isAvailable: data.driverPrice !== 0,
            label: t("reservation.finalDetails.driverServiceLabel"),
            isCalculating,
            value: formatPrice(data.driverPrice),
          },
          {
            isAvailable: data.extraKmPrice !== 0,
            label: `${t("reservation.finalDetails.extraKilometersFeeLabel")} ${t("reservation.finalDetails.withoutTaxLabel")}`,
            isCalculating,
            value: formatPrice(data.extraKmPrice),
          },
          {
            isAvailable: data.receiveFee !== 0,
            label: t("reservation.finalDetails.pickupFeeLabel"),
            isCalculating,
            value: formatPrice(data.receiveFee),
          },
          {
            isAvailable: data.deliverFee !== 0,
            label: t("reservation.finalDetails.deliveryFeeLabel"),
            isCalculating,
            value: formatPrice(data.deliverFee),
          },
        ]}
      />

      <ReservationFinalDetailsItem
        offer
        itemHeader={t("reservation.finalDetails.discountsAndOffersHeader")}
        items={[
          {
            isAvailable: data.carDaysDiscount !== 0,
            label: t("reservation.finalDetails.rentalDaysOfferDiscountLabel", {
              days: data.days,
            }),
            isCalculating,
            value: <span dir="ltr">-{formatPrice(data.carDaysDiscount)}</span>,
          },
          {
            isAvailable: data.promoDiscount !== 0,
            label: t("reservation.finalDetails.promoCodeLabel"),
            isCalculating,
            value: <span dir="ltr">-{formatPrice(data.promoDiscount)}</span>,
          },
          {
            isAvailable: data.pointsDiscount !== 0,
            label: t("reservation.finalDetails.pointsDiscountLabel"),
            isCalculating,
            value: <span dir="ltr">-{formatPrice(data.pointsDiscount)}</span>,
          },
        ]}
      />

      <ReservationFinalDetailsItem
        showSeparator
        itemHeader={t("reservation.finalDetails.amountDetailsHeader")}
        items={[
          {
            label: t("reservation.finalDetails.totalBeforeTaxLabel"),
            isCalculating,
            value: formatPrice(data.totalBeforeTax),
          },
          {
            label: t("reservation.finalDetails.taxValueLabel"),
            isCalculating,
            value: formatPrice(data.taxValue),
          },
        ]}
      />
    </div>
  );
};

export default ExtensionPriceBreakdown;
