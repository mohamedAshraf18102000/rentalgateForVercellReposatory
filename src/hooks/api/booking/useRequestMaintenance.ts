import {
    createMaintenanceRequest,
} from "@/services/mybookings/MaintenanceRequest..service";
import { MaintenanceRequestPayload } from "@/types/myBookings/Maintenance";
import { useMutation } from "@tanstack/react-query";

export const useRequestMaintenance = () => {
    return useMutation({
        mutationFn: (payload: MaintenanceRequestPayload) =>
            createMaintenanceRequest(payload),
    });
};
