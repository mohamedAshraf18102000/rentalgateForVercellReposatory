/**
 * Reverse geocode coordinates to a human-readable address
 * using the Google Maps Geocoding REST API.
 */
type GoogleAddressComponent = {
  long_name: string;
  types: string[];
};

function getLocalAddress(components: GoogleAddressComponent[]): string | null {
  const preferredGroups = [
    ["sublocality_level_1", "sublocality", "neighborhood"],
    ["route"],
    ["locality", "administrative_area_level_2"],
    ["administrative_area_level_1", "country"],
  ];

  const pickedParts = preferredGroups
    .map((group) =>
      components.find((component) =>
        group.some((type) => component.types.includes(type)),
      ),
    )
    .filter(
      (component): component is GoogleAddressComponent => component !== undefined,
    )
    .map((component) => component.long_name);

  const uniqueParts = [...new Set(pickedParts)];
  if (uniqueParts.length > 0) {
    return uniqueParts.join("، ");
  }

  return null;
}

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
      const components = data.results[0]?.address_components;
      if (Array.isArray(components)) {
        const localAddress = getLocalAddress(components);
        if (localAddress) return localAddress;
      }

      return data.results[0].formatted_address;
    }

    console.warn("Reverse geocode returned no results:", data.status);
    return null;
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return null;
  }
}
