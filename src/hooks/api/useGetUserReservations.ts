import { useQuery } from "@tanstack/react-query";
import { getUserReservations } from "@/services/mybookings/userReservations.service";
import { UserReservationsPaylod } from "@/types/myBookings/myBookings";

export const useGetUserReservations = (localStatus: UserReservationsPaylod) => {
  return useQuery({
    queryKey: ["user-reservations", localStatus],
    queryFn: () => getUserReservations(localStatus),
    enabled: !!localStatus,
  });
};
