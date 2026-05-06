import {
  createRating,
  type CreateRatingPayload,
} from "@/services/mybookings/ratings.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRatingPayload) => createRating(payload),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user-reservations"],
      });
    },
  });
};
