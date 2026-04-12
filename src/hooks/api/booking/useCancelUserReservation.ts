import { cancelUserReservation } from "@/services/mybookings/cancelUserReservation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCancelUserReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationID: number) => cancelUserReservation(reservationID),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user-reservations"],
      });
    },
  });
};
