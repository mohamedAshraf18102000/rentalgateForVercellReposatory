import { fetcher } from "../api";

type ValidatePromoResponse = {
  PromoCodeValid: boolean;
};

type ErrorResponse = {
  message: string;
};

export const validatePromoCode = async (code: string): Promise<boolean> => {
  try {
    const res = await fetcher<ValidatePromoResponse>(
      `/promo-codes/validate?code=${code}`,
    );

    return res.PromoCodeValid;
  } catch (error) {
    // لو الـ fetcher بيرجع error فيه response
    const message: string =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Something went wrong";

    throw new Error(message);
  }
};
