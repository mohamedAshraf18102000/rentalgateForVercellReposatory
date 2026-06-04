"use client";

import { useCreateRating } from "@/hooks/api/booking/useCreateRating";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { RatingFormValues, RatingReservationContext } from "./rating.types";
import {
  buildCreateRatingPayload,
  getRatingSectionVisibility,
  RATING_FORM_DEFAULT_VALUES,
} from "./rating.utils";

type UseRatingParams = RatingReservationContext & {
  reservationId?: number | null;
  onBack?: () => void;
};

export function useRating({
  reservationId,
  onBack,
  reservation_deliver_type,
  reservation_receive_type,
  driver_price,
}: UseRatingParams) {
  const { mutate: createRating, isPending: isCreatingRating } =
    useCreateRating();

  const visibility = useMemo(
    () =>
      getRatingSectionVisibility({
        reservation_deliver_type,
        reservation_receive_type,
        driver_price,
      }),
    [reservation_deliver_type, reservation_receive_type, driver_price],
  );

  const { control, handleSubmit } = useForm<RatingFormValues>({
    defaultValues: RATING_FORM_DEFAULT_VALUES,
  });

  const onSubmit = (values: RatingFormValues) => {
    if (!reservationId) {
      toast.error("لا يوجد رقم حجز صالح", {
        position: "top-center",
      });
      return;
    }

    createRating(
      buildCreateRatingPayload(reservationId, values, visibility),
      {
        onSuccess: () => {
          toast.success("تم ارسال التقييم بنجاح", {
            position: "top-center",
          });
          onBack?.();
        },
      },
    );
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isCreatingRating,
    visibility,
  };
}
