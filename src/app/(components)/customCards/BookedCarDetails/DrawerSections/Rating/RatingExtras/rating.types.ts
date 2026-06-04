export type RatingFormValues = {
  companyRate: number;
  rate: number;
  deliveryDriverRate: number;
  pickupDriverRate: number;
  serviceDriverRate: number;
  deliveryDriverComments: string;
  pickupDriverComments: string;
  serviceDriverComments: string;
  comments: string;
};

export type RatingReservationContext = {
  reservation_deliver_type?: string;
  reservation_receive_type?: string;
  driver_price?: number;
};

export type RatingSectionVisibility = {
  showDeliveryDriver: boolean;
  showPickupDriver: boolean;
  showServiceDriver: boolean;
};
