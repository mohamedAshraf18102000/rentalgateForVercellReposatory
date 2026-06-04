import { MaintenanceRequestPayload } from "@/types/myBookings/Maintenance";
import { fetcher } from "../api";

export const createMaintenanceRequest = (data: MaintenanceRequestPayload) => {
    return fetcher<void>(
        `/maintenance-requests`,
        { method: "POST", body: JSON.stringify(data) }
    );
};