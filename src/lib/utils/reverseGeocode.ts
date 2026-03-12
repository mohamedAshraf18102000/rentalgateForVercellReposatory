/**
 * Reverse geocode coordinates to a human-readable address
 * using the Google Maps Geocoding REST API.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key is not set");
      return null;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ar`,
    );
    const data = await response.json();

    if (data.status === "OK" && data.results?.length > 0) {
      return data.results[0].formatted_address;
    }

    console.warn("Reverse geocode returned no results:", data.status);
    return null;
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return null;
  }
}
