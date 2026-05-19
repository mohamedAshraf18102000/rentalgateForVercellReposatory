import type { ClientData } from "@/lib/api/types/client.types";
import { useClientStore } from "@/lib/api/stores";
import type { QueryClient } from "@tanstack/react-query";

const normalizeClientData = (data: unknown): ClientData | null => {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;

  if (typeof record.clientId === "number") {
    return record as unknown as ClientData;
  }

  if (record.data && typeof record.data === "object") {
    const nested = record.data as Record<string, unknown>;
    if (typeof nested.clientId === "number") {
      return nested as unknown as ClientData;
    }
  }

  return null;
};

export const syncUserProfileCaches = (
  queryClient: QueryClient,
  response?: unknown,
) => {
  const clientData = normalizeClientData(response);
  const { setClientData, fetchClientData } = useClientStore.getState();

  if (clientData) {
    queryClient.setQueryData<ClientData>(["userProfile"], clientData);

    const current = useClientStore.getState().clientData;
    setClientData(current ? { ...current, ...clientData } : clientData);
  }

  void queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  void fetchClientData({ force: true });
};
