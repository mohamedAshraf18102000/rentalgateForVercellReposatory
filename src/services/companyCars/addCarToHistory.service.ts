import { fetcher } from "../api";

interface IaddCarTohistoryPayload {
    ccbId: number;
}

export const addCarToHistory = (payload: IaddCarTohistoryPayload) => {
    return fetcher<void>("/cars-seen-history/quick-record", {
        method: "POST",
        body: JSON.stringify(payload),
    });
};
