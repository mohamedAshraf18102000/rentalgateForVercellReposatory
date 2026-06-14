
export const statusTranslations = {
    CREATED: {
        ar: "تم إنشاء الطلب",
        en: "Created",
        color: "bg-StatusBrownBG text-StatusBrown200",
    },
    PAID: {
        ar: "تم الدفع و في انتظار التأكيد",
        en: "Paid and Waiting for Confirmation",
        color: "bg-StatusBrownBG text-StatusBrown200",
    },
    STARTED: {
        ar: "نشط الأن",
        en: "Active Now",
        color: "bg-StatusGreen text-StatusDarkGreen",
    },
    IN_PROGRESS: {
        ar: "تم التأكيد",
        en: "Confirmed",
        color: "bg-blue-100 text-blue-700",
    },
    HOLD: {
        ar: "قيد الانتظار",
        en: "On Hold",
        color: "bg-Grey100 text-Grey700",
    },
    EXTENDED: {
        ar: "تم التمديد",
        en: "Extended",
        color: "bg-StatusGreen text-StatusDarkGreen",
    },
    FINISHED: {
        ar: "منهي",
        en: "Finished",
        color: "bg-Grey100 text-Grey700",
    },
    CANCELLED: {
        ar: "ملغي",
        en: "Cancelled",
        color: "bg-red-100 text-StatusRed",
    },
    DECLINED: {
        ar: "مرفوض",
        en: "Declined",
        color: "bg-red-100 text-StatusRed",
    },
    ADMIN_APPROVED: {
        ar: "تم التأكيد",
        en: "Approved",
        color: "bg-blue-100 text-blue-700",
    },
    AUTOMATICALLY_EXTENDED: {
        ar: "نشط الأن",
        en: "Active Now",
        color: "bg-StatusGreen text-StatusDarkGreen",
    },
    WALLET_PAID: {
        ar: "مدفوع من المحفظة",
        en: "Wallet Paid",
        color: "bg-StatusBrownBG text-StatusBrown200",
    },
    LOCATION_CHANGED: {
        ar: "تم تغيير الموقع وفى انتظار الدفع",
        en: "Location Changed and Waiting for Payment",
        color: "bg-StatusBrownBG text-StatusBrown200",
    },
    FINISHED_BY_DRIVER: {
        ar: "منهي",
        en: "Finished",
        color: "bg-Grey100 text-Grey700",
    },
} as const;

export type Status = keyof typeof statusTranslations;
export type Lang = "ar" | "en";

const ACTIVE_RESERVATION_STATUSES = ["STARTED", "AUTOMATICALLY_EXTENDED"] as const;

export const isActiveReservationStatus = (status: string) =>
    ACTIVE_RESERVATION_STATUSES.includes(
        status as (typeof ACTIVE_RESERVATION_STATUSES)[number],
    );

export const getStatusColor = (status: string): string =>
    statusTranslations[status as Status]?.color ?? "bg-Grey100 text-Grey700";
