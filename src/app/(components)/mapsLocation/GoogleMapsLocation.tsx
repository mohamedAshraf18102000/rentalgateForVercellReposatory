<<<<<<< Updated upstream
"use client";
=======
<<<<<<< Updated upstream
"use client"
import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
=======
>>>>>>> Stashed changes
import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "../ui/input";
<<<<<<< Updated upstream
import { Search } from "lucide-react";
=======
import { LocateFixed, Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useLocationStore } from "@/lib/stores/useLocationStore";
>>>>>>> Stashed changes
>>>>>>> Stashed changes

const mapStyle = {
  width: "100%",
  height: "100%",
};

<<<<<<< Updated upstream
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
<<<<<<< Updated upstream
=======
    )
}

export default GoogleMapsLocation
=======
const defaultLocation = { lat: 0, lng: 0 };

const GoogleMapsLocation = () => {
  const { latitude, longitude, setLocation } = useLocationStore();
  const [currentLocation, setCurrentLocation] = useState({
    lat: latitude || defaultLocation.lat,
    lng: longitude || defaultLocation.lng,
  });
  const [loading, setLoading] = useState(!latitude && !longitude);
  const autocompleteRef = useRef<any>(null);
  const mapRef = useRef<google.maps.Map | null>(null); // <-- map ref

  useEffect(() => {
    if (latitude && longitude) {
      setCurrentLocation({ lat: latitude, lng: longitude });
      setLoading(false);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newPos);
          setLocation(newPos.lat, newPos.lng);
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
  }, [latitude, longitude, setLocation]);

  // Pan map to currentLocation whenever it changes
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
      setLocation(newPos.lat, newPos.lng, place.formatted_address);
      console.log(newPos);
    }
  };

  return (
    <div className="w-full h-full relative">
      {loading ? (
        <div className="flex items-center justify-center h-[450px]">
          <Skeleton className="w-full h-full" />
        </div>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          <div className="w-full rounded-2xl overflow-hidden h-[450px]">
=======
          <div className="relative w-full rounded-2xl overflow-hidden h-[450px]">
            <button className="rounded-full z-9999 absolute bottom-19 right-2.5 ">
              <LocateFixed className="w-10 h-10 text-blue-600" />
            </button>
>>>>>>> Stashed changes
            <GoogleMap
              mapContainerStyle={mapStyle}
              center={currentLocation}
              zoom={15}
              options={{
                mapTypeControl: false,
                fullscreenControl: false,
<<<<<<< Updated upstream
=======
                streetViewControl: false,
              }}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              onClick={(e) => {
                const newPos = {
                  lat: e.latLng?.lat() || 0,
                  lng: e.latLng?.lng() || 0,
                };
                setCurrentLocation(newPos);
                setLocation(newPos.lat, newPos.lng);
                console.log(newPos);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes

export default GoogleMapsLocation;
