import { useQuery } from "@tanstack/react-query";
import { getUserReservations } from "@/services/mybookings/userReservationDetails.service";

export const useGetUserReservationById = (
  reservationID: number,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["user-reservation-details", reservationID],
    queryFn: () => getUserReservations(reservationID),
    enabled,
  });
};
