/**
 * Reverse geocode coordinates to a human-readable address
 * using the Google Maps Geocoding REST API.
 */
type GoogleAddressComponent = {
  long_name: string;
  types: string[];
};

type GoogleGeocodeResult = {
  formatted_address: string;
  types: string[];
  address_components?: GoogleAddressComponent[];
};

type GoogleNearbyPlace = {
  name?: string;
  types?: string[];
};

type GoogleNearbySearchResponse = {
  status?: string;
  results?: GoogleNearbyPlace[];
};

export type GeocodedLocationCategory = "AIRPORT" | "TRAIN_STATION" | null;

export type ReverseGeocodeMeta = {
  category: GeocodedLocationCategory;
  matchedName: string | null;
  placeTypes: string[];
};

export type ReverseGeocodeDetails = {
  address: string | null;
  meta: ReverseGeocodeMeta;
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

const normalizeText = (value: string) => value.trim().toLowerCase();

const CATEGORY_SEARCH_RADIUS_METERS = 500;

const AIRPORT_KEYWORDS = ["airport", "مطار"];

const TRAIN_KEYWORDS = [
  "train",
  "railway",
  "rail",
  "station",
  "قطار",
  "محطة",
];

function extractMatchedName(result: GoogleGeocodeResult): string | null {
  if (!Array.isArray(result.address_components)) {
    return null;
  }

  const pointOfInterest = result.address_components.find((component) =>
    component.types.includes("point_of_interest"),
  );

  if (pointOfInterest?.long_name) {
    return pointOfInterest.long_name;
  }

  const premise = result.address_components.find((component) =>
    component.types.includes("premise"),
  );

  if (premise?.long_name) {
    return premise.long_name;
  }

  const establishment = result.address_components.find((component) =>
    component.types.includes("establishment"),
  );

  return establishment?.long_name ?? null;
}

function classifyGeocodeResult(result: GoogleGeocodeResult): ReverseGeocodeMeta {
  const rawTypes = Array.isArray(result.types) ? result.types : [];
  const normalizedTypes = rawTypes.map((type) => normalizeText(type));
  const matchedName = extractMatchedName(result);
  const searchableText = normalizeText(
    [result.formatted_address, matchedName].filter(Boolean).join(" "),
  );

  const isAirport =
    normalizedTypes.includes("airport") ||
    AIRPORT_KEYWORDS.some((keyword) => searchableText.includes(keyword));
  if (isAirport) {
    return {
      category: "AIRPORT",
      matchedName,
      placeTypes: rawTypes,
    };
  }

  const hasTrainType =
    normalizedTypes.includes("train_station") ||
    normalizedTypes.includes("transit_station") ||
    normalizedTypes.includes("subway_station");
  const hasTrainKeyword = TRAIN_KEYWORDS.some((keyword) =>
    searchableText.includes(keyword),
  );

  if (hasTrainType || hasTrainKeyword) {
    return {
      category: "TRAIN_STATION",
      matchedName,
      placeTypes: rawTypes,
    };
  }

  return {
    category: null,
    matchedName,
    placeTypes: rawTypes,
  };
}

async function detectNearbyCategory(
  lat: number,
  lng: number,
  apiKey: string,
): Promise<ReverseGeocodeMeta | null> {
  const nearbyTypes: Array<{
    type: "airport" | "train_station";
    category: Exclude<GeocodedLocationCategory, null>;
  }> = [
    { type: "airport", category: "AIRPORT" },
    { type: "train_station", category: "TRAIN_STATION" },
  ];

  for (const nearbyType of nearbyTypes) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${CATEGORY_SEARCH_RADIUS_METERS}&type=${nearbyType.type}&language=ar&key=${apiKey}`,
    );
    const data = (await response.json()) as GoogleNearbySearchResponse;

    if (data.status === "OK" && Array.isArray(data.results) && data.results[0]) {
      const firstMatch = data.results[0];
      return {
        category: nearbyType.category,
        matchedName: firstMatch.name ?? null,
        placeTypes: Array.isArray(firstMatch.types) ? firstMatch.types : [],
      };
    }
  }

  return null;
}

export async function reverseGeocodeWithDetails(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeDetails | null> {
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
      const primaryResult = data.results[0] as GoogleGeocodeResult;
      const components = primaryResult?.address_components;
      let parsedAddress: string | null = null;

      if (Array.isArray(components)) {
        parsedAddress = getLocalAddress(components);
      }

      const address = parsedAddress || primaryResult.formatted_address || null;
      const detectedFromGeocode =
        data.results
          .map((result: GoogleGeocodeResult) => classifyGeocodeResult(result))
          .find((candidate: ReverseGeocodeMeta) => candidate.category !== null) ||
        classifyGeocodeResult(primaryResult);
      let nearbyMeta: ReverseGeocodeMeta | null = null;
      const canUseNearbyFallback = typeof window === "undefined";

      if (detectedFromGeocode.category === null && canUseNearbyFallback) {
        try {
          nearbyMeta = await detectNearbyCategory(lat, lng, apiKey);
        } catch (error) {
          // Nearby Places REST endpoint is not CORS-enabled for browser calls.
          // Keep reverse geocode working for all locations even if fallback fails.
          console.warn(
            "[reverseGeocodeWithDetails] Nearby category fallback failed:",
            error,
          );
        }
      }
      const meta = nearbyMeta ?? detectedFromGeocode;

      console.log("[reverseGeocodeWithDetails] Google place types", {
        lat,
        lng,
        primaryTypes: primaryResult?.types ?? [],
        allResultTypes: data.results.map(
          (result: GoogleGeocodeResult) => result.types ?? [],
        ),
        detectedCategory: meta.category,
        matchedName: meta.matchedName,
        nearbyFallbackUsed: nearbyMeta !== null,
      });

      return { address, meta };
    }

    console.warn("Reverse geocode returned no results:", data.status);
    return null;
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return null;
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  const details = await reverseGeocodeWithDetails(lat, lng);
  return details?.address ?? null;
}
