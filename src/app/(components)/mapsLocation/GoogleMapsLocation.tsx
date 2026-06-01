"use client";
import { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Input } from "../ui/input";
import { LocateFixed, Loader2, Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import {
  ReverseGeocodeMeta,
  reverseGeocodeWithDetails,
} from "@/lib/utils/reverseGeocode";
import { useDebounce } from "./hooks/useDebounce";
import { usePlacesAutocomplete } from "./hooks/usePlacesAutocomplete";
import { useTranslations } from "next-intl";

const defaultLocation = { lat: 0, lng: 0 };
const libraries: "places"[] = ["places"];

const GoogleMapsLocation = ({
  zoomPercent = 15,
  storeless = false,
  onLocationChange,
  initialLat,
  initialLng,
  selectedLat,
  selectedLng,
  hideSearch = false,
  hideUserLocation = false,
  disableInitialGeolocation = false,
  containerHeight = "400px",
  className = "",
}: {
  zoomPercent?: number;
  storeless?: boolean;
  onLocationChange?: (
    lat: number,
    lng: number,
    address: string,
    isManual?: boolean,
    geocodeMeta?: ReverseGeocodeMeta,
  ) => void;
  initialLat?: number;
  initialLng?: number;
  selectedLat?: number;
  selectedLng?: number;
  hideSearch?: boolean;
  hideUserLocation?: boolean;
  /** Parent handles browser geolocation (e.g. location dialog auto-detect). */
  disableInitialGeolocation?: boolean;
  containerHeight?: string;
  className?: string;
}) => {
  const t = useTranslations("common");
  const {
    userPhysical_Latitude,
    userPhysical_Longitude,
    userPhysical_Address,
    setUserPhysical_Location,
  } = useLocationStore();
  const [currentLocation, setCurrentLocation] = useState({
    lat: initialLat || userPhysical_Latitude || defaultLocation.lat,
    lng: initialLng || userPhysical_Longitude || defaultLocation.lng,
  });

  const [locationLoading, setLocationLoading] = useState(() => {
    if (disableInitialGeolocation) {
      return selectedLat == null || selectedLng == null;
    }

    return (
      !(initialLat && initialLng) &&
      !userPhysical_Latitude &&
      !userPhysical_Longitude
    );
  });
  const [mapLoading, setMapLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  const hasCalledInitialChange = useRef(false);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const handleSetLocation = (
    lat: number,
    lng: number,
    address: string | null,
    isManual = false,
    geocodeMeta?: ReverseGeocodeMeta,
  ) => {
    if (!storeless) setUserPhysical_Location(lat, lng, address);
    if (onLocationChangeRef.current)
      onLocationChangeRef.current(
        lat,
        lng,
        address || "",
        isManual,
        geocodeMeta,
      );
  };

  const initializeLocation = async (lat?: number, lng?: number) => {
    const pos = {
      lat: lat || userPhysical_Latitude || defaultLocation.lat,
      lng: lng || userPhysical_Longitude || defaultLocation.lng,
    };
    setCurrentLocation(pos);
    setLocationLoading(false);

    if (!hasCalledInitialChange.current) {
      hasCalledInitialChange.current = true;
      const details = await reverseGeocodeWithDetails(pos.lat, pos.lng);
      const address = userPhysical_Address || details?.address || null;
      handleSetLocation(pos.lat, pos.lng, address, false, details?.meta);
    }
  };

  useEffect(() => {
    if (!disableInitialGeolocation) {
      return;
    }

    if (selectedLat != null && selectedLng != null) {
      setLocationLoading(false);
    }
  }, [disableInitialGeolocation, selectedLat, selectedLng]);

  useEffect(() => {
    const setup = async () => {
      if (initialLat && initialLng) {
        await initializeLocation(initialLat, initialLng);
        return;
      }

      if (!storeless && userPhysical_Latitude && userPhysical_Longitude) {
        await initializeLocation();
        return;
      }

      if (disableInitialGeolocation) {
        if (selectedLat != null && selectedLng != null) {
          setCurrentLocation({ lat: selectedLat, lng: selectedLng });
        }
        setLocationLoading(false);
        return;
      }

      if (navigator.geolocation) {
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
  }, [
    disableInitialGeolocation,
    initialLat,
    initialLng,
    selectedLat,
    selectedLng,
    storeless,
    userPhysical_Address,
    userPhysical_Latitude,
    userPhysical_Longitude,
  ]);

  useEffect(() => {
    if (mapRef.current) mapRef.current.panTo(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    if (selectedLat == null || selectedLng == null) {
      return;
    }

    const newPos = { lat: selectedLat, lng: selectedLng };
    setCurrentLocation(newPos);
    mapRef.current?.panTo(newPos);
  }, [selectedLat, selectedLng]);

  const handleLocateUser = async () => {
    try {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported");
        return;
      }

      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        alert(
          "Location access is blocked. Please enable it from your browser settings.",
        );
        return;
      }

      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          setCurrentLocation(newPos);
          mapRef.current?.panTo(newPos);

          const details = await reverseGeocodeWithDetails(
            newPos.lat,
            newPos.lng,
          );

          handleSetLocation(
            newPos.lat,
            newPos.lng,
            details?.address ?? null,
            true,
            details?.meta,
          );

          setIsLocating(false);
        },
        (err) => {
          console.error(err);

          switch (err.code) {
            case err.PERMISSION_DENIED:
              alert("Location permission was denied.");
              break;

            case err.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;

            case err.TIMEOUT:
              alert("Location request timed out.");
              break;

            default:
              alert("Failed to get your location.");
          }

          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } catch (error) {
      console.error(error);
      setIsLocating(false);
    }
  };

  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue);
  const { predictions, setPredictions: clearPredictions } =
    usePlacesAutocomplete(debouncedValue, isLoaded);

  const geocodePlace = (placeId: string) =>
    new Promise<{
      lat: number;
      lng: number;
      address: string;
      geocodeMeta: ReverseGeocodeMeta;
    }>((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          const placeTypes = Array.isArray(results[0].types)
            ? results[0].types
            : [];
          const searchableText = results[0].formatted_address.toLowerCase();
          const isAirport =
            placeTypes.includes("airport") ||
            searchableText.includes("airport");
          const isTrain =
            placeTypes.includes("train_station") ||
            placeTypes.includes("transit_station") ||
            placeTypes.includes("subway_station") ||
            searchableText.includes("train") ||
            searchableText.includes("railway") ||
            searchableText.includes("station") ||
            searchableText.includes("قطار") ||
            searchableText.includes("محطة");

          console.log("[GoogleMapsLocation] Google geocode place types", {
            placeId,
            formattedAddress: results[0].formatted_address,
            placeTypes,
            detectedCategory: isAirport
              ? "AIRPORT"
              : isTrain
                ? "TRAIN_STATION"
                : null,
          });

          resolve({
            lat: loc.lat(),
            lng: loc.lng(),
            address: results[0].formatted_address,
            geocodeMeta: {
              category: isAirport
                ? "AIRPORT"
                : isTrain
                  ? "TRAIN_STATION"
                  : null,
              matchedName: null,
              placeTypes,
            },
          });
        } else reject(status);
      });
    });

  const handleSelectPlace = async (
    place: google.maps.places.AutocompletePrediction,
  ) => {
    try {
      const { lat, lng, address, geocodeMeta } = await geocodePlace(
        place.place_id,
      );
      setCurrentLocation({ lat, lng });
      mapRef.current?.panTo({ lat, lng });
      handleSetLocation(lat, lng, address, true, geocodeMeta);
      clearPredictions();
      setInputValue("");
    } catch (err) {
      console.error("Geocode failed:", err);
    }
  };
  const showInitialLoading = !isLoaded || locationLoading;

  return (
    <div
      className={`w-full flex flex-col relative ${className}`}
      style={{ height: containerHeight }}
    >
      {!hideSearch && (
        <div className="relative z-50">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            wrapperClassName="mb-3"
            className="bg-white text-sm rounded-xl w-full"
            type="search"
            placeholder={t("searchPlaceholder")}
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

      <div className="relative w-full rounded-2xl overflow-hidden flex-1">
        {showInitialLoading && (
          <div className="absolute inset-0 z-50">
            <Skeleton className="h-full w-full bg-Grey100" />
          </div>
        )}
        {!showInitialLoading && mapLoading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
        {!hideUserLocation && !showInitialLoading && (
          <button
            type="button"
            onClick={handleLocateUser}
            disabled={isLocating}
            className="rounded-full z-9999 absolute top-4 right-4 bg-white/80 p-2 shadow-md hover:bg-white transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            title="الموقع الحالي"
          >
            {isLocating ? (
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            ) : (
              <LocateFixed className="w-6 h-6 text-blue-600" />
            )}
          </button>
        )}
        {!showInitialLoading && (
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
              setMapLoading(true);
            }}
            onTilesLoaded={() => {
              setMapLoading(false);
            }}
            onClick={async (e) => {
              const newPos = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };
              setCurrentLocation(newPos);
              clearPredictions();
              setInputValue("");
              const details = await reverseGeocodeWithDetails(
                newPos.lat,
                newPos.lng,
              );
              handleSetLocation(
                newPos.lat,
                newPos.lng,
                details?.address ?? null,
                true,
                details?.meta,
              );
            }}
          >
            <div className="bg-red-600! p-10!">
              <Marker position={currentLocation} />
            </div>
            {/* <Marker
              position={currentLocation}
              icon={{
                url: "/images/car-marker.png",
                scaledSize: new google.maps.Size(40, 40),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(20, 20),
              }}
            /> */}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default GoogleMapsLocation;
