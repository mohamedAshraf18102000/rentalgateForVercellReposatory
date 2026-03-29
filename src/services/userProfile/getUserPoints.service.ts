import { UserPoints } from "@/types/userProfile/userPoints";
import { fetcher } from "../api";

export const getUserPoints = async (): Promise<UserPoints> => {
  return fetcher<UserPoints>("/client-points/my-available-points");
};
