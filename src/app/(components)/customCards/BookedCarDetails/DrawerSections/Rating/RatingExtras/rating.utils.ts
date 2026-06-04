import type { CreateRatingPayload } from "@/services/mybookings/ratings.service";
import type {
  RatingFormValues,
  RatingReservationContext,
  RatingSectionVisibility,
} from "./rating.types";

export const RATING_FORM_DEFAULT_VALUES: RatingFormValues = {
  companyRate: 5,
  rate: 5,
  deliveryDriverRate: 5,
  pickupDriverRate: 5,
  deliveryDriverComments: "",
  pickupDriverComments: "",
  comments: "",
  serviceDriverRate: 5,
  serviceDriverComments: "",
};

export function getRatingSectionVisibility(
  context: RatingReservationContext,
): RatingSectionVisibility {
  return {
    showDeliveryDriver: context.reservation_receive_type !== "BRANCH",
    showPickupDriver: context.reservation_deliver_type !== "BRANCH",
    showServiceDriver: Number(context.driver_price) > 0,
  };
}

export function buildCreateRatingPayload(
  reservationId: number,
  values: RatingFormValues,
  visibility: RatingSectionVisibility,
): CreateRatingPayload {
  const payload: CreateRatingPayload = {
    reservationId,
    companyRate: values.companyRate,
    rate: values.rate,
    comments: values.comments,
  };

  if (visibility.showDeliveryDriver) {
    payload.deliveryDriverRate = values.deliveryDriverRate;
    payload.deliveryDriverComments = values.deliveryDriverComments;
  }

  if (visibility.showPickupDriver) {
    payload.pickupDriverRate = values.pickupDriverRate;
    payload.pickupDriverComments = values.pickupDriverComments;
  }

  if (visibility.showServiceDriver) {
    payload.serviceDriverRate = values.serviceDriverRate;
    payload.serviceDriverComments = values.serviceDriverComments;
  }

  return payload;
}
