/**
 * Branches Data Hook
 * Manages fetching and state for branches by city and all branches
 */

'use client';

import { URL } from '@/constants/api';
import { useCallback, useState } from 'react';

interface Branch {
  branchId: number;
  cityId: number;
  branchName: string;
  branchArName: string;
  latitude: number;
  longitude: number;
  mobile: string;
  email: string;
  phone1: string;
  phone2: string | null;
  addressEnglish: string;
  addressArabic: string;
  bcode: string | null;
  googlePlaceId: string | null;
  notes: string | null;
  workingHoures?: string;
}

export const useBranchesData = () => {
  const [branchesData, setBranchesData] = useState<Branch[]>([]);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCityId, setCurrentCityId] = useState<number | null>(null);

  // Default map center (Jeddah)
  const defaultMapCenter = { lat: 21.4858, lng: 39.1925 };

  /**
   * Fetch branches for a specific city
   */
  const fetchCityBranches = useCallback(async (cityId: number) => {
    if (isLoading) {
      return;
    }
    
    if (currentCityId === cityId) {
      return;
    }
    
    setIsLoading(true);
    setCurrentCityId(cityId);
    
    try {
      setBranchesData([]);
      const url = URL(`/branches/city/${cityId}`);
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      
      // Handle the API response structure: { message: "SUCCESS", data: [...] }
      if (json.message === 'SUCCESS' && json.data) {
        setBranchesData(json.data);
      } else {
        setBranchesData([]);
      }
    } catch (error) {
      console.error('Error fetching city branches:', error);
      setBranchesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, currentCityId]);

  /**
   * Fetch all branches from all cities
   */
  const fetchAllBranches = useCallback(async (cities: Array<{ cityId: number }>) => {
    setIsLoading(true);
    
    try {
      if (!cities || cities.length === 0) {
        setAllBranches([]);
        return;
      }
      
      // Fetch branches for each city in parallel
      const allBranchesPromises = cities.map(async (city) => {
        try {
          const branchesResponse = await fetch(URL(`/branches/city/${city.cityId}`));
          
          if (!branchesResponse.ok) {
            return [];
          }
          
          const json = await branchesResponse.json();
          
          // Handle the API response structure: { message: "SUCCESS", data: [...] }
          if (json.message === 'SUCCESS' && json.data) {
            return json.data;
          }
          
          return [];
        } catch (error) {
          console.error(`Error fetching branches for city ${city.cityId}:`, error);
          return [];
        }
      });
      
      const allBranchesResults = await Promise.all(allBranchesPromises);
      const allBranchesFlat = allBranchesResults.flat();
      
      setAllBranches(allBranchesFlat);
      
    } catch (error) {
      console.error('Error fetching all branches:', error);
      setAllBranches([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get Google Maps URL for a branch
   */
  const getMapUrlForBranch = useCallback((branch: Branch, locale: string) => {
    if (branch.latitude && branch.longitude) {
      const address = locale === 'en' ? branch.addressEnglish : branch.addressArabic;
      if (address) {
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps?q=${encodedAddress}&hl=${locale === 'ar' ? 'ar' : 'en'}&z=16&output=embed`;
      } else {
        return `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}&hl=${locale === 'ar' ? 'ar' : 'en'}&z=16&output=embed`;
      }
    }
    return `https://www.google.com/maps?q=${defaultMapCenter.lat},${defaultMapCenter.lng}&hl=${locale === 'ar' ? 'ar' : 'en'}&z=14&output=embed`;
  }, [defaultMapCenter]);

  return {
    branchesData,
    allBranches,
    isLoading,
    currentCityId,
    defaultMapCenter,
    fetchCityBranches,
    fetchAllBranches,
    getMapUrlForBranch
  };
};

export default useBranchesData;

