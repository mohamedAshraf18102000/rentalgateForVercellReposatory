export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface TermItem {
    termsId: number;
    englishTitle: string;
    arabicTitle: string;
    englishTerms: string;
    arabicTerms: string;
    lastUpdate: string; // ISO Date
    notes: string | null;
    status: "ACTIVE" | "INACTIVE"; // extend if needed
    title: string;
    terms: string;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface TermsResponse {
    content: TermItem[];
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
