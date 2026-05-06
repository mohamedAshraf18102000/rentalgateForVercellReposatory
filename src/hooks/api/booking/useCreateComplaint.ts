import {
  createComplaint,
  type CreateComplaintPayload,
} from "@/services/mybookings/complaints.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateComplaintPayload) => createComplaint(payload),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user-reservations"],
      });
    },
  });
};
