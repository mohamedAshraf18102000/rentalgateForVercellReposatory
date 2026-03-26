import { HomeResponse } from "@/types/home/home";
import { fetcher } from "../api";

export const getHomePageDetails = async (): Promise<HomeResponse> => {
  return fetcher<HomeResponse>("/main_home");
};