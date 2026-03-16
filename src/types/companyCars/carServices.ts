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

  csType: string;
  priceType: string;

  dailyPrice: number;
  weeklyPrice: number;
  halfMonthly: number;
  monthly: number;
  yearly: number;

  notes: string | null;
}

export type CompanyServicesResponse = CompanyService[];
