import { useGuestAuthStore } from "@/lib/stores/useGuestAuthStore";

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const { token } = useGuestAuthStore.getState();

  const res = await fetch(`https://rentalgate.net/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}
