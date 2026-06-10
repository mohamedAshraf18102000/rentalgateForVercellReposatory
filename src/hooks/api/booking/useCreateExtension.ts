import {
  createExtension,
} from "@/services/mybookings/createExtension.service";
import type { ExtendReservationPayload } from "@/services/mybookings/extendReservation.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateExtension = () => {
  return useMutation({
    mutationFn: (payload: ExtendReservationPayload) => createExtension(payload),
    onError: (error: Error) => {
      if (error.message === "FE-STOP-TOAST") return;
      toast.error(error.message, { position: "top-center" });
    },
  });
};
