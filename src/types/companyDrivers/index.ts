export interface Company {
    companyId: number;
    englishName: string;
    arabicName: string;
    responsibleName: string;
    responsibleMobile: string;
    companyStatus: "active" | "inactive" | string;
    logo: string;
}

export interface CompanyService {
    cdsId: number;
    companyId: number;
    companyEnglishName: string;
    companyArabicName: string;
    cdsType: "in" | "out" | string;

    dayNumberHours: number;
    hourPrice: number;
    extraHourPrice: number;
    minHours: number;

    dailyPrice: number;
    weeklyPrice: number;
    halfMonthPrice: number;
    monthlyPrice: number;
    yearlyPrice: number;

    percentage: number;
    notes: string;

    company: Company;
}


export type CompanyDriversPricingResponse = CompanyService[];