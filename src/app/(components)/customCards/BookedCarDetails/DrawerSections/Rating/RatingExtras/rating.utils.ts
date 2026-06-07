import type { CreateRatingPayload } from "@/services/mybookings/ratings.service";
import type {
  RatingFormValues,
  RatingReservationContext,
  RatingSectionVisibility,
} from "./rating.types";

export const RATING_FORM_DEFAULT_VALUES: RatingFormValues = {
  companyRate: 0,
  rate: 0,
  deliveryDriverRate: 0,
  pickupDriverRate: 0,
  deliveryDriverComments: "",
  pickupDriverComments: "",
  comments: "",
  serviceDriverRate: 0,
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

export function hasAtLeastOneRating(
  values: RatingFormValues,
  visibility: RatingSectionVisibility,
): boolean {
  if (values.companyRate > 0 || values.rate > 0) {
    return true;
  }

  if (visibility.showDeliveryDriver && values.deliveryDriverRate > 0) {
    return true;
  }

  if (visibility.showPickupDriver && values.pickupDriverRate > 0) {
    return true;
  }

  if (visibility.showServiceDriver && values.serviceDriverRate > 0) {
    return true;
  }

  return false;
}

export function buildCreateRatingPayload(
  reservationId: number,
  values: RatingFormValues,
  visibility: RatingSectionVisibility,
): CreateRatingPayload {
  const payload: CreateRatingPayload = {
    reservationId,
    comments: values.comments,
  };

  if (values.companyRate > 0) {
    payload.companyRate = values.companyRate;
  }

  if (values.rate > 0) {
    payload.rate = values.rate;
  }

  if (visibility.showDeliveryDriver && values.deliveryDriverRate > 0) {
    payload.deliveryDriverRate = values.deliveryDriverRate;
    payload.deliveryDriverComments = values.deliveryDriverComments;
  }

  if (visibility.showPickupDriver && values.pickupDriverRate > 0) {
    payload.pickupDriverRate = values.pickupDriverRate;
    payload.pickupDriverComments = values.pickupDriverComments;
  }

  if (visibility.showServiceDriver && values.serviceDriverRate > 0) {
    payload.serviceDriverRate = values.serviceDriverRate;
    payload.serviceDriverComments = values.serviceDriverComments;
  }

  return payload;
}
