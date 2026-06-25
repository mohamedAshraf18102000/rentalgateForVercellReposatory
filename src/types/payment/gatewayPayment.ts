export type GatewayPaymentStatus = "CREATED";

export type GatewayPaymentData = {
  paymentId: number;
  paymentUrl: string;
  status: GatewayPaymentStatus;
};

export type PayWithGatewayResponse = {
  message: string;
  status: boolean;
  data: GatewayPaymentData;
};

export type TelrPaymentTargetType = "RESERVATION" | "EXTENSION";

export type TelrPaymentStatusValue = "PAID";

export type TelrPaymentStatusData = {
  paymentId: number;
  targetType: TelrPaymentTargetType;
  targetId: number;
  status: TelrPaymentStatusValue;
  amount: number;
  currency: string;
  paidAt: string;
};

export type GetTelrPaymentStatusResponse = {
  message: string;
  status: boolean;
  data: TelrPaymentStatusData;
};
