import { fetcher } from "../api";
import { ClientData } from "@/lib/api/types/client.types";

export const deleteAddress = (addressId: string | number) => {
  return fetcher<ClientData>(`/client-addresses/remove`, {
    method: "DELETE",
    body: JSON.stringify({ addressId }),
  });
};
