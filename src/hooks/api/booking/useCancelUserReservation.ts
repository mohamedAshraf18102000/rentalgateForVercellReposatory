import { cancelUserReservation } from "@/services/mybookings/cancelUserReservation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CancelUserReservationPayload = {
  reservationID: number;
  reasonId: number;
  notes: string;
};

export const useCancelUserReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationID, reasonId, notes }: CancelUserReservationPayload) =>
      cancelUserReservation(reservationID, reasonId, notes),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user-reservations"],
      });
    },
  });
};
