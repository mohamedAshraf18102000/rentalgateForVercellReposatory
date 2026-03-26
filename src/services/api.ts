import { getCookie } from "@/util/cookies";

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = typeof document !== 'undefined' ? getCookie("authToken") : null;

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
