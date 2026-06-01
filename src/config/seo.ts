
export const SEO_KEYS = {
    HOME: "home",
    BOOKINGS: "bookings",
    CAR_DETAILS: "carDetails",
    RESERVATION: "reservation",
    BUSINESS_ACCOUNTS: "bussinessAccounts",
    USER_PROFILE: "userProfile",
    MY_BOOKINGS: "myBookings",
    WALLET: "wallet",
    OFFERED_CARS: "offeredCars",
} as const;

export type SeoKey = (typeof SEO_KEYS)[keyof typeof SEO_KEYS];