"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import { Input } from "../ui/input";
import { LocateFixed, Loader2, Search, MapPin, Clock } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { reverseGeocode } from "@/lib/utils/reverseGeocode";
import { useDebounce } from "./hooks/useDebounce";
import { usePlacesAutocomplete } from "./hooks/usePlacesAutocomplete";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface LatLng {
  lat: number;
  lng: number;
}

interface RouteInfo {
  distanceText: string;
  durationText: string;
  points: LatLng[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const defaultLocation: LatLng = { lat: 0, lng: 0 };
const libraries: "places"[] = ["places"];

// ─────────────────────────────────────────────────────────────────────────────
// OSRM polyline decoder
// ─────────────────────────────────────────────────────────────────────────────
function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

// ─────────────────────────────────────────────────────────────────────────────
// OSRM route fetcher
// ─────────────────────────────────────────────────────────────────────────────
async function fetchRoute(
  origin: LatLng,
  destination: LatLng,
): Promise<RouteInfo | null> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
      `?overview=full&geometries=polyline`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const payload = await res.json();
    const routes = payload?.routes as
      | Array<{
          distance: number;
          duration: number;
          geometry: string;
        }>
      | undefined;

    if (!routes?.length) return null;

    const route = routes[0];

    const distanceM = route.distance ?? 0;
    const distanceText =
      distanceM >= 1000
        ? `${(distanceM / 1000).toFixed(1)} km`
        : `${Math.round(distanceM)} m`;

    const durationSec = route.duration ?? 0;
    const durationMin = Math.round(durationSec / 60);
    const durationText =
      durationMin >= 60
        ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`
        : `${durationMin} min`;

    const points = route.geometry?.length ? decodePolyline(route.geometry) : [];

    return { distanceText, durationText, points };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Fit-bounds helper
// ─────────────────────────────────────────────────────────────────────────────
function fitMapToBothPoints(
  map: google.maps.Map,
  point1: LatLng,
  point2: LatLng,
  padding = 64,
) {
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(point1);
  bounds.extend(point2);
  map.fitBounds(bounds, padding);
}

function openInGoogleMaps(destination: LatLng, origin?: LatLng) {
  const dest = `${destination.lat},${destination.lng}`;
  const base = "https://www.google.com/maps/dir/";
  const url = origin
    ? `${base}${origin.lat},${origin.lng}/${dest}`
    : `${base}/${dest}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function samePoint(a: LatLng, b: LatLng) {
  return Math.abs(a.lat - b.lat) < 0.00001 && Math.abs(a.lng - b.lng) < 0.00001;
}

// ─────────────────────────────────────────────────────────────────────────────
// Route info pill
// ─────────────────────────────────────────────────────────────────────────────
function RouteInfoPill({
  distanceText,
  durationText,
}: {
  distanceText: string;
  durationText: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(255,255,255,0.97)",
        borderRadius: 999,
        padding: "5px 12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.13)",
        fontSize: 12,
        fontWeight: 500,
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <MapPin size={13} color="#1A73E8" strokeWidth={2.5} />
      <span style={{ color: "#1A73E8", fontWeight: 700 }}>{distanceText}</span>
      <span
        style={{
          width: 1,
          height: 13,
          background: "#d1d5db",
          display: "inline-block",
          margin: "0 4px",
        }}
      />
      <Clock size={13} color="#555" strokeWidth={2} />
      <span style={{ color: "#555" }}>{durationText}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom SVG pin marker — with optional label above the pin
// ─────────────────────────────────────────────────────────────────────────────
async function buildCustomPinMarker(
  logoUrl?: string,
  color = "#1A73E8",
  label?: string,
): Promise<google.maps.Icon> {
  const PIN_W = 40;
  const PIN_H = 52;
  const CX = PIN_W / 2;
  const HEAD_CY = 18;
  const HEAD_R = 16;
  const RING_R = 11;
  const LOGO_R = 9;

  // ── Label dimensions ───────────────────────────────────────────────
  // Measure how wide the label text needs to be so the pill fits snugly.
  // We approximate 6.5px per character at 9px font, then add padding.
  const truncated = label
    ? label.length > 14
      ? label.slice(0, 14) + "…"
      : label
    : "";
  const LABEL_TEXT_W = truncated
    ? Math.max(truncated.length * 6.5 + 16, 40)
    : 0;
  const LABEL_H = truncated ? 18 : 0;

  // Total canvas size — label sits above the pin
  const TOTAL_W = Math.max(PIN_W, LABEL_TEXT_W);
  const TOTAL_H = PIN_H + LABEL_H;

  // Pin is horizontally centred within the wider canvas
  const PIN_OFFSET_X = (TOTAL_W - PIN_W) / 2;
  const LABEL_CX = TOTAL_W / 2;

  const shift = (hex: string, amt: number) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const c = (v: number) => Math.max(0, Math.min(255, v));
    return `rgb(${c((n >> 16) + amt)},${c(((n >> 8) & 0xff) + amt)},${c(
      (n & 0xff) + amt,
    )})`;
  };
  const colorLight = shift(color, 45);
  const colorDark = shift(color, -55);

  const pinPath =
    `M ${CX} ${PIN_H - 4}` +
    ` C ${CX - 4} ${PIN_H - 14}, ${CX - HEAD_R} ${HEAD_CY + 14}, ${CX - HEAD_R} ${HEAD_CY}` +
    ` A ${HEAD_R} ${HEAD_R} 0 1 1 ${CX + HEAD_R} ${HEAD_CY}` +
    ` C ${CX + HEAD_R} ${HEAD_CY + 14}, ${CX + 4} ${PIN_H - 14}, ${CX} ${PIN_H - 4} Z`;

  const svgSrc = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${TOTAL_W}" height="${TOTAL_H}"
     viewBox="0 0 ${TOTAL_W} ${TOTAL_H}">
  <defs>
    <linearGradient id="body" x1="0.25" y1="0" x2="0.75" y2="1">
      <stop offset="0%" stop-color="${colorLight}"/>
      <stop offset="100%" stop-color="${colorDark}"/>
    </linearGradient>
    <linearGradient id="gloss" x1="0.3" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="white" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="white" stop-opacity="0.00"/>
    </linearGradient>
    <filter id="sh" x="-50%" y="-30%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
      <feOffset dx="0" dy="2"/>
      <feColorMatrix type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  ${
    truncated
      ? `
  <!-- Label pill above pin -->
  <g filter="url(#sh)">
    <rect
      x="${LABEL_CX - LABEL_TEXT_W / 2}"
      y="0"
      width="${LABEL_TEXT_W}"
      height="${LABEL_H - 2}"
      rx="${(LABEL_H - 2) / 2}"
      fill="transparent"
      fill-opacity="0.97"
    />
  </g>
  <text
    x="${LABEL_CX}"
    y="${LABEL_H / 2 + 1}"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="system-ui, -apple-system, Arial, sans-serif"
    font-size="12"
    font-weight="700"
    fill="${color}"
  >${truncated}</text>
  `
      : ""
  }

  <!-- Pin (offset so it centres under the label) -->
  <g filter="url(#sh)" transform="translate(${PIN_OFFSET_X}, ${LABEL_H})">
    <circle cx="${CX}" cy="${HEAD_CY}" r="${HEAD_R + 3}"
      fill="none" stroke="${color}" stroke-width="1.2" stroke-opacity="0.2"/>
    <path d="${pinPath}" fill="url(#body)"/>
    <path d="${pinPath}" fill="url(#gloss)"/>
    <circle cx="${CX}" cy="${HEAD_CY}" r="${RING_R}"
      fill="white" fill-opacity="0.97"/>
    <circle cx="${CX}" cy="${HEAD_CY}" r="${RING_R}"
      fill="none" stroke="${colorDark}" stroke-width="0.8" stroke-opacity="0.1"/>
    <circle cx="${CX}" cy="${HEAD_CY}" r="${LOGO_R}"
      fill="${color}" fill-opacity="0.08"/>
    <circle cx="${CX}" cy="${PIN_H - 4}" r="1.8"
      fill="${colorDark}" fill-opacity="0.5"/>
  </g>
</svg>`;

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const SCALE = 3;
    canvas.width = TOTAL_W * SCALE;
    canvas.height = TOTAL_H * SCALE;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(SCALE, SCALE);

    const svgImg = new Image();
    svgImg.onload = () => {
      ctx.drawImage(svgImg, 0, 0, TOTAL_W, TOTAL_H);
      URL.revokeObjectURL(svgImg.src);

      const done = () =>
        resolve({
          url: canvas.toDataURL("image/png"),
          scaledSize: new google.maps.Size(TOTAL_W, TOTAL_H),
          // Anchor at the needle tip — horizontally centred, at the very bottom
          anchor: new google.maps.Point(LABEL_CX, TOTAL_H - 4),
        });

      if (!logoUrl) {
        done();
        return;
      }

      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.onload = () => {
        // Logo sits inside the pin head, offset by PIN_OFFSET_X and LABEL_H
        const logoCX = PIN_OFFSET_X + CX;
        const logoCY = LABEL_H + HEAD_CY;
        ctx.save();
        ctx.beginPath();
        ctx.arc(logoCX, logoCY, LOGO_R, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
          logo,
          logoCX - LOGO_R,
          logoCY - LOGO_R,
          LOGO_R * 2,
          LOGO_R * 2,
        );
        ctx.restore();
        done();
      };
      logo.onerror = done;
      logo.src = logoUrl;
    };

    const blob = new Blob([svgSrc], { type: "image/svg+xml" });
    svgImg.src = URL.createObjectURL(blob);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const GoogleMapsPolyLinedLocation = ({
  zoomPercent = 15,
  storeless = false,
  onLocationChange,
  initialLat,
  initialLng,
  hideSearch = false,
  hideUserLocation = false,
  containerHeight = "400px",
  className = "",
  destinationLat,
  destinationLng,
  destinationName,
  destinationLogoUrl,
  autoFitBounds = true,
  disableMapClickToChangeLocation = false,
}: {
  zoomPercent?: number;
  storeless?: boolean;
  onLocationChange?: (
    lat: number,
    lng: number,
    address: string,
    isManual?: boolean,
  ) => void;
  initialLat?: number;
  initialLng?: number;
  hideSearch?: boolean;
  hideUserLocation?: boolean;
  containerHeight?: string;
  className?: string;
  destinationLat?: number;
  destinationLng?: number;
  destinationName?: string;
  destinationLogoUrl?: string;
  autoFitBounds?: boolean;
  disableMapClickToChangeLocation?: boolean;
}) => {
  const {
    latitude,
    longitude,
    address: storeAddress,
    setLocation,
  } = useLocationStore();

  const [currentLocation, setCurrentLocation] = useState<LatLng>({
    lat: initialLat || latitude || defaultLocation.lat,
    lng: initialLng || longitude || defaultLocation.lng,
  });

  const [locationLoading, setLocationLoading] = useState(
    !(initialLat && initialLng) && !latitude && !longitude,
  );
  const [isLocating, setIsLocating] = useState(false);

  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [destinationIcon, setDestinationIcon] =
    useState<google.maps.Icon | null>(null);
  const [showDestinationInfo, setShowDestinationInfo] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  const hasCalledInitialChange = useRef(false);
  const routeFetchedRef = useRef(false);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // ── Build custom destination marker (now passes destinationName as label) ──
  useEffect(() => {
    if (!isLoaded || !destinationLat || !destinationLng) return;
    buildCustomPinMarker(destinationLogoUrl, "#1A73E8", destinationName).then(
      setDestinationIcon,
    );
  }, [
    isLoaded,
    destinationLat,
    destinationLng,
    destinationLogoUrl,
    destinationName,
  ]);

  // ── Route loading ───────────────────────────────────────────────────────
  const loadRoute = useCallback(
    async (userPos: LatLng) => {
      if (!destinationLat || !destinationLng) return;
      const dest: LatLng = { lat: destinationLat, lng: destinationLng };
      if (samePoint(userPos, dest)) return;
      if (routeFetchedRef.current) return;
      routeFetchedRef.current = true;

      const info = await fetchRoute(userPos, dest);
      if (info) setRouteInfo(info);
    },
    [destinationLat, destinationLng],
  );

  // ── Fit bounds ──────────────────────────────────────────────────────────
  const fitBounds = useCallback(
    (userPos: LatLng) => {
      if (
        !mapRef.current ||
        !autoFitBounds ||
        !destinationLat ||
        !destinationLng
      )
        return;
      const dest: LatLng = { lat: destinationLat, lng: destinationLng };
      if (samePoint(userPos, dest)) return;
      fitMapToBothPoints(mapRef.current, userPos, dest);
    },
    [autoFitBounds, destinationLat, destinationLng],
  );

  const handleSetLocation = (
    lat: number,
    lng: number,
    address: string | null,
    isManual = false,
  ) => {
    if (!storeless) setLocation(lat, lng, address);
    if (onLocationChangeRef.current)
      onLocationChangeRef.current(lat, lng, address || "", isManual);
  };

  const initializeLocation = async (lat?: number, lng?: number) => {
    const pos: LatLng = {
      lat: lat || latitude || defaultLocation.lat,
      lng: lng || longitude || defaultLocation.lng,
    };
    setCurrentLocation(pos);
    setLocationLoading(false);

    if (!hasCalledInitialChange.current) {
      hasCalledInitialChange.current = true;
      const address = storeAddress || (await reverseGeocode(pos.lat, pos.lng));
      handleSetLocation(pos.lat, pos.lng, address, false);
    }

    await loadRoute(pos);
    fitBounds(pos);
  };

  useEffect(() => {
    const setup = async () => {
      if (initialLat && initialLng) {
        await initializeLocation(initialLat, initialLng);
      } else if (latitude && longitude) {
        await initializeLocation();
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            await initializeLocation(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => {
            console.error(err);
            setLocationLoading(false);
          },
        );
      } else {
        setLocationLoading(false);
      }
    };
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, initialLat, initialLng, storeAddress]);

  useEffect(() => {
    if (mapRef.current) mapRef.current.panTo(currentLocation);
  }, [currentLocation]);

  const handleLocateUser = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newPos: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentLocation(newPos);
        mapRef.current?.panTo(newPos);
        const address = await reverseGeocode(newPos.lat, newPos.lng);
        handleSetLocation(newPos.lat, newPos.lng, address, true);

        routeFetchedRef.current = false;
        await loadRoute(newPos);
        fitBounds(newPos);

        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
      },
    );
  };

  // ── Search ──────────────────────────────────────────────────────────────
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue);
  const { predictions, setPredictions: clearPredictions } =
    usePlacesAutocomplete(debouncedValue, isLoaded);

  const geocodePlace = (placeId: string) =>
    new Promise<{ lat: number; lng: number; address: string }>(
      (resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ placeId }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const loc = results[0].geometry.location;
            resolve({
              lat: loc.lat(),
              lng: loc.lng(),
              address: results[0].formatted_address,
            });
          } else reject(status);
        });
      },
    );

  const handleSelectPlace = async (
    place: google.maps.places.AutocompletePrediction,
  ) => {
    try {
      const { lat, lng, address } = await geocodePlace(place.place_id);
      setCurrentLocation({ lat, lng });
      mapRef.current?.panTo({ lat, lng });
      handleSetLocation(lat, lng, address, true);
      clearPredictions();
      setInputValue("");
    } catch (err) {
      console.error("Geocode failed:", err);
    }
  };

  // ── Derived values ──────────────────────────────────────────────────────
  const hasDestination = !!(destinationLat && destinationLng);
  const destinationPos: LatLng | null = hasDestination
    ? { lat: destinationLat!, lng: destinationLng! }
    : null;

  const hasRoute =
    routeInfo &&
    routeInfo.points.length >= 2 &&
    destinationPos &&
    !samePoint(currentLocation, destinationPos);

  const routePolylinePath = hasRoute ? routeInfo!.points : [];

  // ── Loading state ───────────────────────────────────────────────────────
  if (!isLoaded || locationLoading) {
    return (
      <div className="w-full h-full relative">
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full flex flex-col relative ${className}`}
      style={{ height: containerHeight }}
    >
      {/* ── Search input ──────────────────────────────────────────────── */}
      {!hideSearch && (
        <div className="relative z-50">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            wrapperClassName="mb-3"
            className="bg-white text-sm rounded-xl w-full"
            type="search"
            placeholder="بحث ..."
            startIcon={<Search className="w-6 h-6" />}
          />
          {predictions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 overflow-hidden">
              {predictions.map((item) => (
                <div
                  key={item.place_id}
                  className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectPlace(item)}
                >
                  {item.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Map container ─────────────────────────────────────────────── */}
      <div className="relative w-full rounded-2xl overflow-hidden flex-1">
        {/* Locate-me button */}
        {!hideUserLocation && (
          <button
            type="button"
            onClick={handleLocateUser}
            disabled={isLocating}
            className="rounded-full z-[9999] absolute top-4 right-4 bg-white/80 p-2 shadow-md hover:bg-white transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            title="الموقع الحالي"
          >
            {isLocating ? (
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            ) : (
              <LocateFixed className="w-6 h-6 text-blue-600" />
            )}
          </button>
        )}

        {/* ── Route info pill ─────────────────────────────────────────── */}
        {hasRoute && routeInfo && (
          <RouteInfoPill
            distanceText={routeInfo.distanceText}
            durationText={routeInfo.durationText}
          />
        )}

        {/* ── Navigate button ─────────────────────────────────────────── */}
        {destinationPos && (
          <button
            type="button"
            onClick={() => openInGoogleMaps(destinationPos, currentLocation)}
            className="z-[9999] absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white flex items-center gap-2 px-4 py-2 shadow-lg text-sm font-medium rounded-2xl whitespace-nowrap"
            title="Navigate with Google Maps"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            التوجه الي الفرع
          </button>
        )}

        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={currentLocation}
          zoom={zoomPercent}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          }}
          onLoad={(map) => {
            mapRef.current = map;
            if (destinationPos && !samePoint(currentLocation, destinationPos)) {
              fitMapToBothPoints(map, currentLocation, destinationPos);
            }
          }}
          onClick={async (e) => {
            if (disableMapClickToChangeLocation) return;
            const newPos: LatLng = {
              lat: e.latLng!.lat(),
              lng: e.latLng!.lng(),
            };
            setCurrentLocation(newPos);
            clearPredictions();
            setInputValue("");
            const address = await reverseGeocode(newPos.lat, newPos.lng);
            handleSetLocation(newPos.lat, newPos.lng, address, true);
            routeFetchedRef.current = false;
            await loadRoute(newPos);
          }}
        >
          {/* User / selected location marker */}
          <Marker position={currentLocation} />

          {/* Destination marker with custom pin + label */}
          {destinationPos && (
            <Marker
              animation={google.maps.Animation.DROP}
              position={destinationPos}
              icon={destinationIcon ?? undefined}
              title={destinationName}
              onClick={() => setShowDestinationInfo((v) => !v)}
            >
              {showDestinationInfo && destinationName && (
                <InfoWindow
                  position={destinationPos}
                  onCloseClick={() => setShowDestinationInfo(false)}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: "#1A73E8",
                      padding: "2px 4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {destinationName}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {/* Route polylines */}
          {routePolylinePath.length >= 2 && (
            <>
              <Polyline
                path={routePolylinePath}
                options={{
                  strokeColor: "rgba(26, 115, 232, 0.18)",
                  strokeWeight: 7,
                  geodesic: true,
                  zIndex: 1,
                }}
              />
              <Polyline
                path={routePolylinePath}
                options={{
                  strokeColor: "#1A73E8",
                  strokeWeight: 4,
                  geodesic: true,
                  zIndex: 2,
                }}
              />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapsPolyLinedLocation;
