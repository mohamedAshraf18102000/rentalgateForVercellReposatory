
export const statusTranslations = {
    CREATED: {
        ar: "تم إنشاء الطلب",
        en: "Created",
    },
    PAID: {
        ar: "تم الدفع و في انتظار التأكيد",
        en: "Paid and Waiting for Confirmation",
    },
    STARTED: {
        ar: "نشط الأن",
        en: "Active Now",
    },
    IN_PROGRESS: {
        ar: "تم التأكيد",
        en: "In Progress",
    },
    HOLD: {
        ar: "قيد الانتظار",
        en: "On Hold",
    },
    EXTENDED: {
        ar: "تم التمديد",
        en: "Extended",
    },
    FINISHED: {
        ar: "منهي",
        en: "Finished",
    },
    CANCELLED: {
        ar: "ملغي",
        en: "Cancelled",
    },
    DECLINED: {
        ar: "تم الدفع و في انتظار التأكيد",
        en: "Paid and Waiting for Confirmation",
    },
    ADMIN_APPROVED: {
        ar: "تم التأكيد",
        en: "Approved",
    },
    AUTOMATICALLY_EXTENDED: {
        ar: "نشط الأن",
        en: "Active Now",
    },
    WALLET_PAID: {
        ar: "مدفوع من المحفظة",
        en: "Wallet Paid",
    },
    LOCATION_CHANGED: {
        ar: "تم تغيير الموقع وفى انتظار الدفع",
        en: "Location Changed and Waiting for Payment",
    },
} as const;

export type Status = keyof typeof statusTranslations;
export type Lang = "ar" | "en";

