export interface CancelReason {
    reasonId: number;
    englishReason: string;
    arabicReason: string;
    amount: number;
    reasonType: number;
    lastUpdate: string; // ISO Date
    notes: string | null;
    status: "ACTIVE" | string;
    reason: string;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface CancelReasonsResponse {
    content: CancelReason[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}