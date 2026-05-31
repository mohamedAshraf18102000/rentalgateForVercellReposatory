
export const SEO_KEYS = {
    HOME: "home",
    BOOKINGS: "bookings",
} as const;

export type SeoKey = (typeof SEO_KEYS)[keyof typeof SEO_KEYS];