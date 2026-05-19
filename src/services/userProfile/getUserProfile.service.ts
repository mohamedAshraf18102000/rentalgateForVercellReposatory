import { getClientData } from "@/lib/api/services/client.service";
import type { ClientData } from "@/lib/api/types/client.types";

export const getUserProfile = async (): Promise<ClientData> => {
  const response = await getClientData();
  return response.data;
};
