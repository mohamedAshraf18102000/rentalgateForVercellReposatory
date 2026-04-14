import { extendReservation, ExtendReservationPayload } from "@/services/mybookings/extendReservation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useExtendReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ExtendReservationPayload) => extendReservation(payload),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["user-reservation-details"],
            });
        },
    });
};
