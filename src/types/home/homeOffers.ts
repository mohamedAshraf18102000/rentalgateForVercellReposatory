export interface IOffersResponse {
    content: IOffer[];
    pageable: IPageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: ISort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export interface IOffer {
    offerId: number;
    englishName: string;
    arabicName: string;
    image: string;
    englishImage: string;
    companyNameEnglish: string;
    companyNameArabic: string;
    branchEnglishName: string;
    branchArabicName: string;
    startDate: string;
    endDate: string;
    offerStatus: "active" | "inactive" | string;
    offerType: number;
    offerTypeDescription: string;
    offerValue: number;
    offerCars: number;
    offerCarsDescription: string;
}

export interface IPageable {
    pageNumber: number;
    pageSize: number;
    sort: ISort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface ISort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}