"use client";
import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const mapStyle = {
  width: "100%",
  height: "100%",
};

const defaultLocation = {
  lat: 30.06962611737769,
  lng: 31.45297997529913,
};

const GoogleMapsLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const [loading, setLoading] = useState(true);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },  
        (error) => {
          console.error(error);
          setLoading(false);
        },
      );
    } else {
      setLoading(false);
    }
  }, []);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (place.geometry) {
      const location = place.geometry.location;

      setCurrentLocation({
        lat: location.lat(),
        lng: location.lng(),
      });
    }
  };

  return (
    <div className="w-full h-full relative">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p>Getting your location...</p>
        </div>
      ) : (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          libraries={["places"]}
        >
          <div className="z-50">
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
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
          <div className="w-full rounded-2xl overflow-hidden h-[450px]">
            <GoogleMap
              mapContainerStyle={mapStyle}
              center={currentLocation}
              zoom={15}
              options={{
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker position={currentLocation} />
            </GoogleMap>
          </div>
        </LoadScript>
      )}
    </div>
  );
};

export default GoogleMapsLocation;
