import { fetcher } from "../api";

export interface Promo {
  codeId: number;
  code: string;
  codeType: number;
  discountValue: number;
  creationDate: string;
  startDate: string;
  endDate: string;
  minDiscountAmount: number;
  maxDiscountAmount: number;
  maxUse: number;
  maxUsed: number;
  maxUseToClient: number;
  clientMobile: string;
  notes: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  active: boolean;
}
type ValidatePromoResponse = {
  PromoCodeValid: boolean;
  promo: Promo;
};

export const validatePromoCode = async (
  code: string,
): Promise<ValidatePromoResponse> => {
  try {
    const res = await fetcher<ValidatePromoResponse>(
      `/promo-codes/validate?code=${code}`,
    );

    return res;
  } catch (error) {
    // لو الـ fetcher بيرجع error فيه response
    const message: string =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Something went wrong";

    throw new Error(message);
  }
};
