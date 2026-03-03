"use client"
import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const mapStyle = {
    width: "100%",
    height: "100%",
}

const defaultLocation = {
    lat: 30.06962611737769,
    lng: 31.45297997529913
}

const GoogleMapsLocation = () => {
    const [currentLocation, setCurrentLocation] = useState(defaultLocation)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                    setLoading(false)
                },
                (error) => {
                    console.error("Geolocation error:", error.message)
                    setLoading(false)
                }
            )
        } else {
            console.error("Geolocation is not supported by this browser.")
            setLoading(false)
        }
    }, [])

    return (
        <div className="w-full h-full">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <p>Getting your location...</p>
                </div>
            ) : (
                <LoadScript googleMapsApiKey=''>
                    <GoogleMap mapContainerStyle={mapStyle} center={currentLocation} zoom={12}>
                        <Marker position={currentLocation} />
                    </GoogleMap>
                </LoadScript>
            )}
        </div>
    )
}

export default GoogleMapsLocation

