"use client";
import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Input } from "../ui/input";
import { LocateFixed, Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { reverseGeocode } from "@/lib/utils/reverseGeocode";

const mapStyle = {
  width: "100%",
  height: "100%",
};

const defaultLocation = { lat: 0, lng: 0 };

const libraries: "places"[] = ["places"];

const GoogleMapsLocation = ({
  zoomPercent = 15,
  storeless = false,
  onLocationChange,
}: {
  zoomPercent?: number;
  storeless?: boolean;
  onLocationChange?: (lat: number, lng: number, address: string) => void;
}) => {
  const { latitude, longitude, setLocation } = useLocationStore();
  const [currentLocation, setCurrentLocation] = useState({
    lat: latitude || defaultLocation.lat,
    lng: longitude || defaultLocation.lng,
  });
  const [locationLoading, setLocationLoading] = useState(
    !latitude && !longitude,
  );
  const autocompleteRef = useRef<any>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const handleSetLocation = (lat: number, lng: number, address: string | null) => {
    if (!storeless) {
      setLocation(lat, lng, address);
    }
    if (onLocationChangeRef.current) {
      onLocationChangeRef.current(lat, lng, address || "");
    }
  };

  useEffect(() => {
    if (latitude && longitude && !storeless) {
      setCurrentLocation({ lat: latitude, lng: longitude });
      setLocationLoading(false);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newPos);
          const address = await reverseGeocode(newPos.lat, newPos.lng);
          handleSetLocation(newPos.lat, newPos.lng, address);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, setLocation, storeless]);

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
      handleSetLocation(newPos.lat, newPos.lng, place.formatted_address || "");
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
        handleSetLocation(newPos.lat, newPos.lng, address);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
    );
  };

  if (!isLoaded || locationLoading) {
    return (
      <div className="w-full h-full relative">
        <div className="flex items-center justify-center h-[450px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
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
      <div className="relative w-full rounded-2xl overflow-hidden h-[450px]">
        <button
          type="button"
          onClick={handleLocateUser}
          className="rounded-full z-9999 absolute bottom-[19px] right-2.5 "
        >
          <LocateFixed className="w-10 h-10 text-blue-600" />
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
            handleSetLocation(newPos.lat, newPos.lng, address);
          }}
        >
          <Marker position={currentLocation} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapsLocation;
