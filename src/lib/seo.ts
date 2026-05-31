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