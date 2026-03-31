"use client";
import { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Input } from "../ui/input";
import { LocateFixed, Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { reverseGeocode } from "@/lib/utils/reverseGeocode";

const mapStyle = {
  width: "100%",
  height: "400px",
};

const defaultLocation = { lat: 0, lng: 0 };

const libraries: "places"[] = ["places"];

const GoogleMapsLocation = ({
  zoomPercent = 15,
  storeless = false,
  onLocationChange,
  initialLat,
  initialLng,
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
}) => {
  const {
    latitude,
    longitude,
    address: storeAddress,
    setLocation,
  } = useLocationStore();
  const [currentLocation, setCurrentLocation] = useState({
    lat: initialLat || latitude || defaultLocation.lat,
    lng: initialLng || longitude || defaultLocation.lng,
  });
  const [locationLoading, setLocationLoading] = useState(
    !(initialLat && initialLng) && !latitude && !longitude,
  );
  const autocompleteRef = useRef<any>(null);
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
    isManual: boolean = false,
  ) => {
    if (!storeless) {
      setLocation(lat, lng, address);
    }
    if (onLocationChangeRef.current) {
      onLocationChangeRef.current(lat, lng, address || "", isManual);
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      if (initialLat && initialLng) {
        const pos = { lat: initialLat, lng: initialLng };
        setCurrentLocation(pos);
        setLocationLoading(false);
        if (!hasCalledInitialChange.current) {
          hasCalledInitialChange.current = true;
          const address = await reverseGeocode(pos.lat, pos.lng);
          handleSetLocation(pos.lat, pos.lng, address, false);
        }
      } else if (latitude && longitude) {
        const pos = { lat: latitude, lng: longitude };
        setCurrentLocation(pos);
        setLocationLoading(false);
        if (!hasCalledInitialChange.current) {
          hasCalledInitialChange.current = true;
          const address =
            storeAddress || (await reverseGeocode(pos.lat, pos.lng));
          handleSetLocation(pos.lat, pos.lng, address, false);
        }
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const newPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(newPos);
            const address = await reverseGeocode(newPos.lat, newPos.lng);
            handleSetLocation(newPos.lat, newPos.lng, address, false);
            setLocationLoading(false);
          },
          (error) => {
            console.error(error);
            setLocationLoading(false);
          },
        );
      } else {
        setLocationLoading(false);
      }
    };

    initializeLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, initialLat, initialLng, storeAddress]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(currentLocation);
    }
  }, [currentLocation]);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      const newPos = { lat: location.lat(), lng: location.lng() };
      setCurrentLocation(newPos);
      handleSetLocation(
        newPos.lat,
        newPos.lng,
        place.formatted_address || "",
        true,
      );
      console.log(newPos);
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newPos);
        mapRef.current?.panTo(newPos);
        const address = await reverseGeocode(newPos.lat, newPos.lng);
        handleSetLocation(newPos.lat, newPos.lng, address, true);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
    );
  };

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
    <div className="w-full h-full flex flex-col relative">
      <div className="z-50">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <Input
            wrapperClassName="mb-3!"
            className="bg-white! text-sm! rounded-xl w-full!"
            type="search"
            placeholder="بحث ..."
            startIcon={<Search className="w-6! h-6!" />}
          />
        </Autocomplete>
      </div>
      <div className="relative w-full rounded-2xl overflow-hidden flex-1 min-h-[250px]">
        <button
          type="button"
          onClick={handleLocateUser}
          className="rounded-full z-9999 absolute top-4 right-4 bg-white/80 p-2 shadow-md hover:bg-white transition-all active:scale-95"
          title="الموقع الحالي"
        >
          <LocateFixed className="w-6 h-6 text-blue-600" />
        </button>
        <GoogleMap
          mapContainerStyle={mapStyle}
          center={currentLocation}
          zoom={zoomPercent}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={async (e) => {
            const newPos = {
              lat: e.latLng?.lat() || 0,
              lng: e.latLng?.lng() || 0,
            };
            setCurrentLocation(newPos);
            const address = await reverseGeocode(newPos.lat, newPos.lng);
            handleSetLocation(newPos.lat, newPos.lng, address, true);
          }}
        >
          <Marker position={currentLocation} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapsLocation;
