import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { Check, Receipt, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { status } = await searchParams;
  const isSuccess = status !== "fail";

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
                  تم الدفع بنجاح!
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  شكرًا لك، لقد استلمنا طلبك وجارٍ تجهيزه الآن.
                  <br />
                  ستصلك رسالة تأكيد على بريدك الإلكتروني قريبًا.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-dashed border-slate-200" />

              {/* Order details */}
              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">رقم الطلب</span>
                  <span className="font-semibold text-slate-700 font-mono tracking-wider">
                    #ORD-29481
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
                    ٢٥٠٫٠٠ ج.م
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-dashed border-slate-200" />

              {/* Status steps */}
              {/* <div className="w-full space-y-3">
                {[
                  { label: "تأكيد الدفع", done: true },
                  { label: "تجهيز الطلب", done: false, active: true },
                  { label: "الشحن والتوصيل", done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                        ${
                          step.done
                            ? c.stepDone
                            : step.active
                              ? `${c.stepActive} border-2`
                              : "bg-slate-100 border-2 border-slate-200 text-slate-400"
                        }`}
                    >
                      {step.done ? (
                        <Check className="w-3 h-3 stroke-3" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        step.done
                          ? `${c.stepDoneLabel} font-medium`
                          : step.active
                            ? "text-slate-700 font-medium"
                            : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.active && (
                      <span className="mr-auto text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                        جارٍ التجهيز
                      </span>
                    )}
                  </div>
                ))}
              </div> */}

              {/* CTA buttons */}
              <div className="w-full flex flex-col gap-3 pt-1">
                <Link
                  href="/orders"
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
