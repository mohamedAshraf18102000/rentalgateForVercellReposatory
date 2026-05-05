import { fetcher } from "../api";
import { getAuthToken } from "@/util/auth";

interface IaddCarTohistoryPayload {
    ccbId: number;
}

export const addCarToHistory = (payload: IaddCarTohistoryPayload) => {
    if (!getAuthToken()) {
        return Promise.resolve();
    }

    return fetcher<void>("/cars-seen-history/quick-record", {
        method: "POST",
        body: JSON.stringify(payload),
    });
};
