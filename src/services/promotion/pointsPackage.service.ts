import { fetcher } from "../api";
import { PointPackage } from "@/types/promotions/promotions";

export const getPointPackages = async (): Promise<PointPackage[]> => {
  return fetcher<PointPackage[]>("/points-packages/by-country/1");
};
