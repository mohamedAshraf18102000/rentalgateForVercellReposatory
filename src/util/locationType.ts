export enum LocationType {
    Airport = "AIRPORT",
    Train = "TRAIN_STATION",
    Branch = "BRANCH",
    MyLocation = "MY_LOCATION",
}

export type LocationLocale = "en" | "ar";

const locationTypeTranslations: Record<
    LocationType,
    Record<LocationLocale, string>
> = {
    [LocationType.Airport]: {
        en: "Airport",
        ar: "مطار",
    },
    [LocationType.Train]: {
        en: "Train Station",
        ar: "محطة القطار",
    },
    [LocationType.Branch]: {
        en: "Branch",
        ar: "فرع",
    },
    [LocationType.MyLocation]: {
        en: "My Location",
        ar: "موقع خاص",
    },
};

export const getLocalizedLocationType = (
    locationType: LocationType,
    locale: LocationLocale,
): string => {
    return locationTypeTranslations[locationType][locale];
};