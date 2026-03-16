import { fetcher } from "../api";
import { CompanyServicesResponse } from "@/types/companyCars/carServices";

export const getCarServices = async (
  id: number,
): Promise<CompanyServicesResponse> => {
  return fetcher<CompanyServicesResponse>(`/company-cars-services/company-car-branch/${id}`);
};
