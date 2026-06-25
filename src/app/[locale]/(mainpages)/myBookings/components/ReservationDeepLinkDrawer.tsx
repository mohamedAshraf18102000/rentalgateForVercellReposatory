"use client";

import BookedCarDetailsDrawer from "@/app/(components)/customCards/BookedCarDetails/BookedCarDetailsDrawer";
import { useGetUserReservationById } from "@/hooks/api/useGetUserReservationById";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ReservationDeepLinkDrawer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const reservationIdParam = searchParams.get("reservationId");
  const reservationId = reservationIdParam
    ? Number(reservationIdParam)
    : null;
  const isValidId =
    reservationId !== null && Number.isFinite(reservationId) && reservationId > 0;

  const { data, refetch } = useGetUserReservationById(
    reservationId ?? 0,
    isValidId,
  );

  const clearReservationIdFromUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("reservationId");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  if (!isValidId) return null;

  return (
    <BookedCarDetailsDrawer
      data={data}
      defaultOpen
      onOpen={() => {
        void refetch();
      }}
      onClose={clearReservationIdFromUrl}
    />
  );
};

export default ReservationDeepLinkDrawer;
