import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { redirect } from "@/i18n/routing";
import { getTelrPaymentStatus } from "@/services/payment/gatewayPayment/getTelrPaymentStatus.service";
import type { TelrPaymentStatusData } from "@/types/payment/gatewayPayment";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Check, Receipt, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    paymentId?: string;
    status?: string;
    targetId?: string;
  }>;
}

const TARGET_TYPE_LABELS: Record<string, string> = {
  RESERVATION: "حجز",
  EXTENSION: "تمديد",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PAID: "مدفوع",
};

const CURRENCY_LABELS: Record<string, string> = {
  SAR: "ر.س",
};

const formatPaidAt = (paidAt: string) =>
  new Date(paidAt).toLocaleString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatAmount = (amount: number, currency: string) => {
  const currencyLabel = CURRENCY_LABELS[currency] ?? currency;
  return `${formatPrice(amount)} ${currencyLabel}`;
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { locale } = await params;
  const { paymentId, status, targetId } = await searchParams;

  let paymentStatusData: TelrPaymentStatusData | null = null;

  if (paymentId) {
    try {
      const { data } = await getTelrPaymentStatus(Number(paymentId), {
        skipErrorToast: true,
      });
      paymentStatusData = data;
    } catch {
      redirect({ href: "/myBookings", locale });
    }
  }

  const reservationId =
    paymentStatusData?.targetId ?? (targetId ? Number(targetId) : undefined);

  const myBookingsHref =
    paymentStatusData?.targetType === "RESERVATION" &&
    reservationId &&
    Number.isFinite(reservationId)
      ? `/myBookings?reservationId=${reservationId}`
      : "/myBookings";

  const isSuccess = paymentStatusData
    ? paymentStatusData.status === "PAID"
    : status !== "fail";

  const c = isSuccess
    ? {
        bar: "from-green-400 to-emerald-600",
        ripple: "bg-green-100",
        ring: "bg-green-100",
        icon: "bg-green-500 shadow-green-200",
        amount: "text-green-600",
        stepDone: "bg-green-500 text-white",
        stepActive: "bg-green-100 border-green-400 text-green-600",
        stepDoneLabel: "text-green-600",
        support: "text-green-600",
      }
    : {
        bar: "from-red-400 to-red-600",
        ripple: "bg-red-100",
        ring: "bg-red-100",
        icon: "bg-red-500 shadow-red-200",
        amount: "text-red-600",
        stepDone: "bg-red-500 text-white",
        stepActive: "bg-red-100 border-red-400 text-red-600",
        stepDoneLabel: "text-red-600",
        support: "text-red-600",
      };

  const resultContent = isSuccess
    ? {
        title: "تم تأكيد حجز السيارة بنجاح!",
        lines: [
          "شكرًا لاختيارك خدماتنا.",
          "تم استلام طلب الحجز بنجاح وجارٍ تأكيد تفاصيل الاستلام والتسليم.",
          "ستصلك بيانات الحجز على بريدك الإلكتروني ورسائل الجوال قريبًا.",
        ],
      }
    : {
        title: "لم تكتمل عملية الدفع",
        lines: [
          "عذرًا، لم نتمكن من إتمام عملية الدفع.",
          "لم يتم تأكيد حجزك. يمكنك المحاولة مرة أخرى من صفحة حجوزاتك.",
          "إذا تم خصم المبلغ من حسابك، يرجى التواصل مع الدعم.",
        ],
      };

  return (
    <WrapperContainer exceedNav>
      <div
        className="flex items-center justify-center h-full bg-slate-50 rounded-2xl p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Top accent bar */}
            <div className={`h-1.5 bg-linear-to-l ${c.bar}`} />

            <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center gap-6">
              {/* Animated checkmark */}
              <div className="relative flex items-center justify-center">
                {/* Outer ripple */}
                <span
                  className={`absolute inline-flex h-24 w-24 rounded-full ${c.ripple} animate-ping opacity-30`}
                />
                {/* Middle ring */}
                <span
                  className={`absolute inline-flex h-20 w-20 rounded-full ${c.ring} opacity-60`}
                />
                {/* Icon circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${c.icon} shadow-lg`}
                >
                  <Check className="text-white w-8 h-8 stroke-3" />
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {resultContent.title}
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {resultContent.lines.map((line, index) => (
                    <span key={line}>
                      {index > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-dashed border-slate-200" />

              {/* Payment details */}
              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">رقم الدفع</span>
                  <span className="font-semibold text-slate-700 font-mono tracking-wider">
                    #{paymentStatusData?.paymentId ?? paymentId ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">نوع العملية</span>
                  <span className="font-semibold text-slate-700">
                    {paymentStatusData?.targetType
                      ? (TARGET_TYPE_LABELS[paymentStatusData.targetType] ??
                        paymentStatusData.targetType)
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">رقم الحجز</span>
                  <span className="font-semibold text-slate-700 font-mono tracking-wider">
                    #{paymentStatusData?.targetId ?? targetId ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">حالة الدفع</span>
                  <span className="font-semibold text-slate-700">
                    {paymentStatusData?.status
                      ? (PAYMENT_STATUS_LABELS[paymentStatusData.status] ??
                        paymentStatusData.status)
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">طريقة الدفع</span>
                  <span className="font-semibold text-slate-700">
                    بطاقة ائتمانية
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">المبلغ المدفوع</span>
                  <span className={`font-bold ${c.amount} text-base`}>
                    {paymentStatusData
                      ? formatAmount(
                          paymentStatusData.amount,
                          paymentStatusData.currency,
                        )
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">تاريخ الدفع</span>
                  <span className="font-semibold text-slate-700">
                    {paymentStatusData?.paidAt
                      ? formatPaidAt(paymentStatusData.paidAt)
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-dashed border-slate-200" />

              {/* CTA buttons */}
              <div className="w-full flex flex-col gap-3 pt-1">
                <Link
                  href={myBookingsHref}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                >
                  <Receipt className="w-4 h-4" />
                  <span>عرض تفاصيل الطلب</span>
                  <ArrowRight className="w-4 h-4 mr-auto rotate-180" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>العودة للرئيسية</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 mt-4">
            هل لديك استفسار؟{" "}
            <Link
              href="/support"
              className={`${c.support} hover:underline font-medium`}
            >
              تواصل مع الدعم
            </Link>
          </p>
        </div>
      </div>
    </WrapperContainer>
  );
};

export default Page;
