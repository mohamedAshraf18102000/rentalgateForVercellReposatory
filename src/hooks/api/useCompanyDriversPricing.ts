import { useQuery } from "@tanstack/react-query";
import { companyDriversPricing } from "@/services/companyDrivers/companyDriversPricing.service";

export const useCompanyDriversPricing = (companyId: number) => {
    return useQuery({
        queryKey: ["company-drivers-pricing", companyId],
        queryFn: () => companyDriversPricing(companyId),
        enabled: !!companyId,
    });
};
