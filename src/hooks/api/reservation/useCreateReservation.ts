import { createReservation } from "@/services/createReservation/createReservation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateReservation = () => {
  return useMutation({
    mutationFn: (payload: any) => createReservation(payload),
    onError: (error) => {
      if (error.message === "FE-STOP-TOAST") return;
      toast.error(error.message, { position: "top-center" });
    },
  });
};
