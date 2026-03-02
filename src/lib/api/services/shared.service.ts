/**
 * Shared Data Service - API calls for shared data
 */

import { URL } from "@/util/api";
import type { SharedDataApiResponse, SharedData } from "@/lib/api/types/shared.types";

const SHARED_DATA_API_URL = "/share";

/**
 * Get shared data from API (car models, brands, types, cities, etc.)
 * @returns Shared data response
 */
export const getSharedData = async (): Promise<SharedDataApiResponse> => {
  const response = await fetch(URL(SHARED_DATA_API_URL), {
    method: "GET",
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error("فشل في جلب البيانات المشتركة");
  }

  const json: SharedDataApiResponse = await response.json();
  
  // التحقق من بنية الاستجابة الجديدة
  if (!json.data) {
    throw new Error(json.message || "فشل في جلب البيانات المشتركة");
  }

  // تحويل البيانات لتتوافق مع الواجهة
  // تحويل cityEnName إلى cityName للتوافق مع الكود القديم
  const transformedData: SharedData = {
    ...json.data,
    city: json.data.city.map(city => ({
      ...city,
      cityName: city.cityEnName, // إضافة cityName للتوافق
    })),
  };

  return {
    ...json,
    data: transformedData,
  };
};

/**
 * Check if a branch is available for a specific car
 * @param branchId - The branch ID to check
 * @param carId - The car ID to check availability for
 * @returns Promise<boolean> - true if branch is available, false otherwise
 */
export const checkBranchAvailability = async (
  branchId: number,
  carId: number
): Promise<boolean> => {
  try {
    const response = await fetch(
      URL(`/car-branches/availability/branch/${branchId}/car/${carId}`),
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(`Failed to check branch availability: ${response.status}`);
      return false;
    }

    const json: { message: string; data: boolean } = await response.json();

    // التحقق من بنية الاستجابة الجديدة
    // API الجديد يعيد { message: "SUCCESS", data: boolean }
    return json.data === true;
  } catch (error) {
    console.error("Error checking branch availability:", error);
    return false;
  }
};

/**
 * Break time interface
 */
export interface BreakTime {
  id: number;
  dayOfWeek: 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  startTime: string; // "HH:mm:ss" format
  endTime: string; // "HH:mm:ss" format
}

/**
 * Working hours interface - New API format
 */
export interface WorkingHours {
  hourId?: number;
  branchId?: number | null;
  branchEnName?: string | null;
  branchArName?: string | null;
  // Time strings in format "HH:mm:ss" (e.g., "08:30:00")
  sunOpenTime?: string | null;
  monOpenTime?: string | null;
  tueOpenTime?: string | null;
  wedOpenTime?: string | null;
  thuOpenTime?: string | null;
  friOpenTime?: string | null;
  satOpenTime?: string | null;
  sunCloseTime?: string | null;
  monCloseTime?: string | null;
  tueCloseTime?: string | null;
  wedCloseTime?: string | null;
  thuCloseTime?: string | null;
  friCloseTime?: string | null;
  satCloseTime?: string | null;
  breaks?: BreakTime[]; // Array of break times
}

/**
 * Get working hours for a branch
 * @param branchId - The branch ID
 * @returns Promise<WorkingHours | null> - Working hours data or null if not found
 */
export const getBranchWorkingHours = async (
  branchId: number
): Promise<WorkingHours | null> => {
  try {
    const response = await fetch(
      URL(`/working-hours/branch/${branchId}`),
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      // Check if it's a 404 with WORKING_HOURS_NOT_FOUND message
      if (response.status === 404) {
        try {
          const errorData = await response.json();
          if (errorData.message === 'WORKING_HOURS_NOT_FOUND') {
            console.log(`Working hours not found for branch ${branchId}`);
            return null; // Return null to indicate no working hours available
          }
        } catch {
          // If JSON parsing fails, just return null
        }
      }
      console.error(`Failed to fetch working hours: ${response.status}`);
      return null;
    }

    const data: { message: string; data: WorkingHours } =
      await response.json();

    // Check if message indicates working hours not found
    if (data.message === 'WORKING_HOURS_NOT_FOUND' || !data.data) {
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching working hours:", error);
    return null;
  }
};

