export interface CompanyService {
  csId: number;
  ccServiceId: number;
  companyId: number;
  companyEnglishName: string;
  companyArabicName: string;

  serviceId: number;
  serviceEnglishName: string;
  serviceArabicName: string;
  name: string;

  serviceType: number;
  percentage: number;
  price: number;

  csType: string | "everyday" | "once";
  priceType: string | "same" | "multi";

  dailyPrice: number;
  weeklyPrice: number;
  halfMonthly: number;
  monthly: number;
  yearly: number;

  notes: string | null;
}

export type CompanyServicesResponse = CompanyService[];

/** Fields used by calculateServicePrice — supports partial inputs (e.g. unlimited km). */
export type ServicePriceInput = Pick<
  CompanyService,
  "csType" | "price" | "priceType"
> &
  Partial<
    Pick<
      CompanyService,
      "dailyPrice" | "weeklyPrice" | "halfMonthly" | "monthly" | "yearly"
    >
  >;
