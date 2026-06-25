"use client";

import { Switch } from "@/app/(components)/ui/switch";
import { useTranslations } from "next-intl";

type PaymentGateWayProps = {
  useGateway: boolean;
  onUseGatewayChange: (value: boolean) => void;
};

const PaymentGateWay = ({
  useGateway,
  onUseGatewayChange,
}: PaymentGateWayProps) => {
  const t = useTranslations("carDetails");

  return (
    <div className="flex flex-col justify-between gap-2 p-2 sm:flex-row sm:items-center bg-Grey100 rounded-xl mt-5">
      <div className="flex flex-wrap items-center gap-2">
        <Switch
          id="payment-gateway-switch"
          checked={useGateway}
          onCheckedChange={onUseGatewayChange}
        />
        <p className="text-sm">{t("reservation.gateway.useGatewayLabel")}</p>
      </div>
      <div className="h-6 w-9 self-end sm:self-auto">
        <img
          src="/payment/telrLogo.webp"
          alt="telr logo"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default PaymentGateWay;
