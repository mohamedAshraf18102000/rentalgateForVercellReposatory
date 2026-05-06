import { fetcher } from "../api";

export interface ComplementReason {
    complaintId: number;
    englishReason: string;
    arabicReason: string;
    amount: number | null;
    status: string;
    displayOrder: number | null;
    active: boolean;
    reasonName: string;
}

export const getComplementReasons = () => {
    return fetcher<ComplementReason[]>(`/complaint-reasons`, {
        method: "GET",
    });
};
