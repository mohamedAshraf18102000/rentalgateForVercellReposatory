/**
 * BranchesMap Component
 * Google Maps display for branches with markers and info windows
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { Branch } from '../types/branch.types';

// Type declarations for Google Maps API
declare global {
  interface Window {
    google?: any;
  }
  
  var google: any;
}

interface BranchesMapProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  locale: string;
}

export const BranchesMap: React.FC<BranchesMapProps> = ({
  branches = [],
  selectedBranch = null,
  locale
}) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<any>(null);

  // Load Google Maps script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAtUOb461InzoQoGEVKKVqqLf2NbwSjqdk&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleMapsLoaded(true);
        setIsLoading(false);
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else if (window.google) {
      setGoogleMapsLoaded(true);
      setIsLoading(false);
    }
  }, []);

  // Calculate map center
  const getMapCenter = () => {
    if (selectedBranch && selectedBranch.latitude && selectedBranch.longitude) {
      return { lat: selectedBranch.latitude, lng: selectedBranch.longitude };
    }

    if (branches.length === 0) {
      return { lat: 21.4858, lng: 39.1925 }; // Jeddah default
    }

    const validBranches = branches.filter(branch =>
      branch.latitude && branch.longitude
    );

    if (validBranches.length === 0) {
      return { lat: 21.4858, lng: 39.1925 };
    }

    const centerLat = validBranches.reduce((sum, branch) => sum + branch.latitude, 0) / validBranches.length;
    const centerLng = validBranches.reduce((sum, branch) => sum + branch.longitude, 0) / validBranches.length;

    return { lat: centerLat, lng: centerLng };
  };

  // Initialize map
  useEffect(() => {
    if (!googleMapsLoaded || !window.google) return;

    const mapDiv = document.getElementById('branches-map');
    if (!mapDiv) return;

    const mapCenter = getMapCenter();
    const zoomLevel = selectedBranch ? 16 : (branches.length > 1 ? 10 : 16);

    const newMap = new google.maps.Map(mapDiv, {
      center: mapCenter,
      zoom: zoomLevel,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });

    setMap(newMap);

    const newInfoWindow = new google.maps.InfoWindow();
    setInfoWindow(newInfoWindow);

    // Add custom styles to hide gm-style-iw-chr (close button) if not already added
    if (!document.getElementById('branches-map-styles')) {
      const style = document.createElement('style');
      style.id = 'branches-map-styles';
      style.textContent = `
        .gm-style-iw-chr {
          display: none !important;
        }
        .gm-style-iw-c {
          padding: 0 !important;
        }
        .gm-style-iw-d {
          overflow: hidden !important;
        }
        .gm-style .gm-style-iw-tc::after {
          background: #09090b !important;
          border: 1px solid #27272a !important;
        }
        .gm-style .gm-style-iw-t::after {
          background: #09090b !important;
          border: 1px solid #27272a !important;
        } 
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup
      if (newInfoWindow) {
        newInfoWindow.close();
      }
    };
  }, [googleMapsLoaded, branches, selectedBranch]);

  // Update map center and zoom when branches or selectedBranch changes
  useEffect(() => {
    if (!map || !googleMapsLoaded) return;

    const mapCenter = getMapCenter();
    const zoomLevel = selectedBranch ? 16 : (branches.length > 1 ? 10 : 16);

    map.setCenter(mapCenter);
    map.setZoom(zoomLevel);
  }, [map, branches, selectedBranch, googleMapsLoaded]);

  // Add markers
  useEffect(() => {
    if (!map || !googleMapsLoaded) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const branchesToShow = selectedBranch ? [selectedBranch] : branches;
    const newMarkers: any[] = [];

    branchesToShow.forEach((branch) => {
      if (!branch.latitude || !branch.longitude) return;

      const marker = new google.maps.Marker({
        position: { lat: branch.latitude, lng: branch.longitude },
        map: map,
        title: locale === 'en' ? branch.branchName : branch.branchArName,
      });

      marker.addListener('click', () => {
        if (!infoWindow) return;

        const contentString = createInfoWindowContent(branch);
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Open info window automatically when branch is selected
    if (selectedBranch && infoWindow && newMarkers.length > 0) {
      const selectedMarker = newMarkers.find(marker => {
        const position = marker.getPosition();
        if (!position) return false;
        return (
          Math.abs(position.lat() - selectedBranch.latitude) < 0.0001 &&
          Math.abs(position.lng() - selectedBranch.longitude) < 0.0001
        );
      });

      if (selectedMarker) {
        // Use setTimeout to ensure marker is fully rendered
        setTimeout(() => {
          const contentString = createInfoWindowContent(selectedBranch);
          infoWindow.setContent(contentString);
          infoWindow.open(map, selectedMarker);
        }, 100);
      }
    }

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, branches, selectedBranch, locale, infoWindow, googleMapsLoaded]);

  // Create info window content
  const createInfoWindowContent = (branch: Branch): string => {
    const branchName = locale === 'en' ? branch.branchName : branch.branchArName;
    const address = locale === 'en' ? branch.addressEnglish : branch.addressArabic;
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return `
      <div style="padding: 8px; max-width: 280px; min-width: 250px; font-family: var(--font-zain, 'Zain', sans-serif); direction: ${dir}; background: #09090b; border: 1px solid #27272a; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);">
        <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #e4e4e7; border-bottom: 1px solid #27272a; padding-bottom: 8px; text-align: center;">
          ${branchName}
        </h3> 
        
        <a 
          href="https://www.google.com/maps?q=${branch.latitude},${branch.longitude}" 
          target="_blank" 
          rel="noopener noreferrer"
          style="display: block; margin-top: 8px; padding: 6px 12px; background: #DC340A; color: #e4e4e7; text-align: center; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 12px; transition: background 0.2s;"
          onmouseover="this.style.background='#C02E09'"
          onmouseout="this.style.background='#DC340A'"
        >
          ${locale === 'en' ? 'Open in Google Maps' : 'فتح في خرائط Google'}
        </a>
      </div>
    `;
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{locale === 'ar' ? 'جارٍ تحميل الخريطة...' : 'Loading map...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="branches-map"
      className="w-full h-full overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
};

export default BranchesMap;

