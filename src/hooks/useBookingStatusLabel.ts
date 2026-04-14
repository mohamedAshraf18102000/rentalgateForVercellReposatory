"use client";

import { Lang, Status, statusTranslations } from "@/util/bookingStatus.utils";
import { useParams } from "next/navigation";

export const useStatusLabel = () => {
    const { locale } = useParams();

    return (status: string) => {
        return (
            statusTranslations[status as Status]?.[
            locale as Lang
            ] || status
        );
    };
};