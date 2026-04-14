import { CancelReasonsResponse } from "@/types/myBookings/cancelReasons";
import { fetcher } from "../api";

export const getCancelReasons = () => {
    return fetcher<CancelReasonsResponse>(
        `/cancellation-reasons`,
    );
};
