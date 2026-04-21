import { CompanyDriversPricingResponse } from "@/types/companyDrivers";
import { fetcher } from "../api";

export const companyDriversPricing = async (companyId: number): Promise<CompanyDriversPricingResponse> => {
    return fetcher<CompanyDriversPricingResponse>(`/companies-drivers-pricing/branch/${companyId}`);
};
