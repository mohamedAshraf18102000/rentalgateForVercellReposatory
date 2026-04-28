import { HomeResponse } from "@/types/home/home";
import { unstable_cache } from "next/cache";
import { fetcher } from "../api";

export const getHomePageDetails = async (): Promise<HomeResponse> => {
  return fetcher<HomeResponse>("/main_home");
};

export const getHomePageDetailsCached = unstable_cache(
  async () => getHomePageDetails(),
  ["home-page-details"],
  {
    revalidate: 300,
    tags: ["home-page-details"],
  },
);