import { ChangeLocationPayload, changeReservationLocation } from "@/services/mybookings/changeBookingLocation.service";
import { getUserReservations } from "@/services/mybookings/userReservationDetails.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useChangeReservationLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ChangeLocationPayload) =>
            changeReservationLocation(data),
        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["user-reservations"] }),
                queryClient.fetchQuery({
                    queryKey: ["user-reservation-details", variables.reservationId],
                    queryFn: () => getUserReservations(variables.reservationId),
                }),
            ]);
        },
    });
};