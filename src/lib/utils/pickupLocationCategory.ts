import { ReverseGeocodeMeta } from "@/lib/utils/reverseGeocode";

type CoordinatePoint = {
  latitude: number;
  longitude: number;
};

type DetectPickupCategoryArgs = {
  lat: number;
  lng: number;
  address: string;
  geocodeMeta?: ReverseGeocodeMeta;
  airports?: CoordinatePoint[];
  trainStations?: CoordinatePoint[];
};

type PickupCategory = "airport" | "trainStation" | null;

const AIRPORT_KEYWORDS = ["airport", "مطار"];
const TRAIN_KEYWORDS = [
  "train",
  "station",
  "railway",
  "rail",
  "قطار",
  "محطة",
];
const TRAIN_PLACE_TYPES = ["train_station", "transit_station", "subway_station"];
const AIRPORT_RADIUS_KM = 5;
const TRAIN_RADIUS_KM = 3.5;
const TRAIN_CONFIDENCE_THRESHOLD = 45;

const normalizeText = (value: string) => value.trim().toLowerCase();
const toRad = (value: number) => (value * Math.PI) / 180;

const distanceInKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const containsKeyword = (value: string, keywords: string[]) => {
  const normalizedValue = normalizeText(value);
  return keywords.some((keyword) => normalizedValue.includes(keyword));
};

const isNearAnyPoint = (
  lat: number,
  lng: number,
  points: CoordinatePoint[],
  radiusKm: number,
) => {
  if (!points.length) return false;
  return points.some(
    (point) => distanceInKm(lat, lng, point.latitude, point.longitude) <= radiusKm,
  );
};

const getNearestDistanceKm = (
  lat: number,
  lng: number,
  points: CoordinatePoint[],
) => {
  if (!points.length) return null;
  return points.reduce<number | null>((nearest, point) => {
    const distance = distanceInKm(lat, lng, point.latitude, point.longitude);
    if (nearest === null || distance < nearest) return distance;
    return nearest;
  }, null);
};

const calculateTrainConfidence = ({
  address,
  geocodeMeta,
  nearestStationDistanceKm,
}: {
  address: string;
  geocodeMeta?: ReverseGeocodeMeta;
  nearestStationDistanceKm: number | null;
}) => {
  let score = 0;
  const placeTypes = geocodeMeta?.placeTypes ?? [];
  const hasTrainType = placeTypes.some((type) =>
    TRAIN_PLACE_TYPES.includes(normalizeText(type)),
  );

  if (geocodeMeta?.category === "TRAIN_STATION") score += 60;
  if (hasTrainType) score += 25;
  if (containsKeyword(address, TRAIN_KEYWORDS)) score += 20;

  if (nearestStationDistanceKm !== null) {
    if (nearestStationDistanceKm <= 1) score += 30;
    else if (nearestStationDistanceKm <= 2) score += 20;
    else if (nearestStationDistanceKm <= TRAIN_RADIUS_KM) score += 10;
  }

  return score;
};

export const detectPickupCategory = ({
  lat,
  lng,
  address,
  geocodeMeta,
  airports = [],
  trainStations = [],
}: DetectPickupCategoryArgs): PickupCategory => {
  const isAirport =
    geocodeMeta?.category === "AIRPORT" ||
    containsKeyword(address, AIRPORT_KEYWORDS) ||
    isNearAnyPoint(lat, lng, airports, AIRPORT_RADIUS_KM);

  if (isAirport) {
    return "airport";
  }

  const nearestStationDistanceKm = getNearestDistanceKm(lat, lng, trainStations);
  const trainConfidence = calculateTrainConfidence({
    address,
    geocodeMeta,
    nearestStationDistanceKm,
  });

  if (trainConfidence >= TRAIN_CONFIDENCE_THRESHOLD) {
    return "trainStation";
  }

  return null;
};
