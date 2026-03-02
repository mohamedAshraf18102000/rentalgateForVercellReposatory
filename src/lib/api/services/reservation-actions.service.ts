/**
 * Reservation Actions Service - API calls for reservation actions
 * Handles Cancel, Maintenance Request, and CRM Ticket operations
 */
import { authenticatedFetch, URL } from "@/util/api";


// ==================== Types ====================

export interface CancellationReason {
  reason_id: number;
  englishName: string;
  arabicName: string;
  notes: string | null;
}

export interface CancellationReasonsResponse {
  message: string;
  data: CancellationReason[];
}

export interface CancelReservationRequest {
  reasonId: number;
  notes: string;
}

export interface CancelReservationResponse {
  message: string;
  status?: boolean;
  data?: any;
}

export interface MaintenanceRequestData {
  reservationId: number;
  reqComments: string;
  notes: string;
}

export interface MaintenanceRequestResponse {
  message: string;
  status: boolean;
  data?: any;
}

export interface TicketReason {
  reasonId: number;
  englishName: string;
  arabicName: string;
  notes: string | null;
}

export interface TicketReasonsResponse {
  message: string;
  data: TicketReason[];
}

export interface CRMTicketRequest {
  title: string;
  reservationId: number;
  reasonId: number;
  attachments: string[];
  details: string;
  ticketSource: 4; // Web Site
}

export interface CRMTicketResponse {
  message: string;
  status: boolean;
  data?: any;
}

// ==================== Cancel Reservation ====================

/**
 * Get cancellation reasons
 * @returns List of cancellation reasons
 */
export const getCancellationReasons = async (): Promise<CancellationReason[]> => {
  const response = await authenticatedFetch(URL("/cancellation-reasons"), {
    method: "GET",
  });

  const data: CancellationReasonsResponse = await response.json();

  if (!response.ok || data.message !== "SUCCESS") {
    throw new Error(data.message || "Failed to fetch cancellation reasons");
  }

  return data.data;
};

/**
 * Cancel a reservation
 * @param reservationId - Reservation ID
 * @param request - Cancel request data
 * @returns Cancel response
 */
export const cancelReservation = async (
  reservationId: number,
  request: CancelReservationRequest
): Promise<CancelReservationResponse> => {
  const response = await authenticatedFetch(
    URL(`/reservations/cancel/${reservationId}`),
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );

  const data: CancelReservationResponse = await response.json();

  // Check for success: either status: true or message: "SUCCESS"
  if (!response.ok || (data.status !== undefined && !data.status && data.message !== "SUCCESS")) {
    throw new Error(data.message || "Failed to cancel reservation");
  }

  // If message is SUCCESS, consider it successful even without status field
  if (data.message === "SUCCESS") {
    return data;
  }

  // Fallback: check status if message is not SUCCESS
  if (data.status === false) {
    throw new Error(data.message || "Failed to cancel reservation");
  }

  return data;
};

// ==================== Maintenance Request ====================

/**
 * Submit maintenance request
 * @param request - Maintenance request data
 * @returns Maintenance request response
 */
export const submitMaintenanceRequest = async (
  request: MaintenanceRequestData
): Promise<MaintenanceRequestResponse> => {
  // Validate required fields
  if (!request.reservationId) {
    throw new Error("Reservation ID is required");
  }
  if (!request.reqComments || request.reqComments.trim() === "") {
    throw new Error("Request comments are required");
  }

  const response = await authenticatedFetch(URL("/min-requests"), {
    method: "POST",
    body: JSON.stringify(request),
  });

  const data: MaintenanceRequestResponse = await response.json();

  // Check for success: either status: true or message: "SUCCESS"
  if (!response.ok || (data.status !== undefined && !data.status && data.message !== "SUCCESS")) {
    // Pass the exact message from API for translation
    throw new Error(data.message || "Failed to submit maintenance request");
  }

  // If message is SUCCESS, consider it successful even without status field
  if (data.message === "SUCCESS") {
    return data;
  }

  // Fallback: check status if message is not SUCCESS
  if (data.status === false) {
    throw new Error(data.message || "Failed to submit maintenance request");
  }

  return data;
};

// ==================== CRM Complaint Ticket ====================

/**
 * Get ticket reasons
 * @returns List of ticket reasons
 */
export const getTicketReasons = async (): Promise<TicketReason[]> => {
  const response = await authenticatedFetch(URL("/ticket-reasons"), {
    method: "GET",
  });

  const data: TicketReasonsResponse = await response.json();

  if (!response.ok || data.message !== "SUCCESS") {
    throw new Error(data.message || "Failed to fetch ticket reasons");
  }

  return data.data;
};

/**
 * Submit CRM complaint ticket
 * @param request - CRM ticket request data
 * @returns CRM ticket response
 */
export const submitCRMTicket = async (
  request: CRMTicketRequest
): Promise<CRMTicketResponse> => {
  // Validate required fields
  if (!request.title || request.title.trim() === "") {
    throw new Error("Title is required");
  }
  if (!request.reservationId) {
    throw new Error("Reservation ID is required");
  }
  if (!request.reasonId) {
    throw new Error("Reason is required");
  }
  if (!request.details || request.details.trim() === "") {
    throw new Error("Details are required");
  }

  const response = await authenticatedFetch(URL("/crm-ticket/save-by-client"), {
    method: "POST",
    body: JSON.stringify(request),
  });

  const data: CRMTicketResponse = await response.json();

  // Check for success: either status: true or message: "SUCCESS"
  if (!response.ok || (data.status !== undefined && !data.status && data.message !== "SUCCESS")) {
    throw new Error(data.message || "Failed to submit complaint ticket");
  }

  // If message is SUCCESS, consider it successful even without status field
  if (data.message === "SUCCESS") {
    return data;
  }

  // Fallback: check status if message is not SUCCESS
  if (data.status === false) {
    throw new Error(data.message || "Failed to submit complaint ticket");
  }

  return data;
};

