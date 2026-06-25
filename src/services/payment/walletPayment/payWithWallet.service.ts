import { fetcher } from "../../api";

export type PayReservationWithWalletPayload = {
    reservationId: number;
    amount: number;
};

export const payWithWallet = (payload: PayReservationWithWalletPayload) => {
    return fetcher("/wallets/pay-reservation", {
        method: "POST",
        body: JSON.stringify(payload),
    });
};
