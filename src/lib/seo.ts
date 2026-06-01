import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SeoKey } from "@/config/seo";
import { resolveSeoKeyFromPathname } from "@/config/seo-routes";

export async function createMetadata(key: SeoKey): Promise<Metadata> {
    const t = await getTranslations("seo");

    const title = t(`${key}.title`);
    const description = t(`${key}.description`);

    return {
        title,
        description,

        openGraph: {
            description,
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            description,
        },
    };
}

/** Resolves page SEO from the request pathname (see SEO_ROUTE_MAP). */
export async function resolvePageMetadata(
    pathname: string
): Promise<Metadata | undefined> {
    const key = resolveSeoKeyFromPathname(pathname);
    if (!key) return undefined;
    return createMetadata(key);
}

/** For dynamic pages that need custom metadata (e.g. API-driven titles). */
export function seoMetadata(key: SeoKey) {
    return function generateMetadata() {
        return createMetadata(key);
    };
}

function buildPageMetadata(title: string, description: string): Metadata {
    return {
        title,
        description,

        openGraph: {
            description,
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            description,
        },
    };
}

export async function createCarDetailsMetadata(
    carName?: string,
): Promise<Metadata> {
    const t = await getTranslations("seo");

    const title = carName
        ? t("carDetails.title", { carName })
        : t("carDetails.fallbackTitle");
    const description = carName
        ? t("carDetails.description", { carName })
        : t("bookings.description");

    return buildPageMetadata(title, description);
}

export async function createReservationMetadata(
    carName?: string,
): Promise<Metadata> {
    const t = await getTranslations("seo");

    const title = carName
        ? t("reservation.title", { carName })
        : t("reservation.fallbackTitle");
    const description = carName
        ? t("reservation.description", { carName })
        : t("reservation.fallbackDescription");

    return buildPageMetadata(title, description);
}

export async function createOfferedCarsMetadata(
    offerLabel?: string,
    carCount?: number,
): Promise<Metadata> {
    const t = await getTranslations("seo");

    const title = offerLabel
        ? t("offeredCars.title", { offerLabel })
        : t("offeredCars.fallbackTitle");

    let description: string;
    if (offerLabel) {
        description =
            carCount && carCount > 0
                ? t("offeredCars.descriptionWithCount", {
                      offerLabel,
                      count: carCount,
                  })
                : t("offeredCars.description", { offerLabel });
    } else {
        description = t("offeredCars.fallbackDescription");
    }

    return buildPageMetadata(title, description);
}