export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`https://rentalgate.net/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}
