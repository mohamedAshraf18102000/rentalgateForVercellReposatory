import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import {
  getBookingTerms,
  getCancelationTerms,
  getPaymentTerms,
} from "@/services/termsAndConditions/cancelationTerms.service";
import { TermItem } from "@/types/termsAndConditions/cancelationTerms";
import { setRequestLocale } from "next-intl/server";
import { FileText, Ban, HandCoins } from "lucide-react";
import { Separator } from "@/app/(components)/ui/separator";
import { Badge, Card, HashAnchorScroller } from "@/app/(components)";
import { CardContent, CardHeader, CardTitle } from "@/app/(components)/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
    <FileText className="w-8 h-8 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);

const TermSection = ({ term }: { term: TermItem }) => (
  <div className="py-4 first:pt-0 last:pb-0">
    <h3 className="text-sm font-semibold text-foreground mb-1.5">
      {term.title || term.arabicTitle}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
      {term.terms || term.arabicTerms}
    </p>
  </div>
);

const Page = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  let cancelationTerms: TermItem[] = [];
  let bookingTerms: TermItem[] = [];
  let paymentTerms: TermItem[] = [];

  try {
    const response = await getCancelationTerms();
    cancelationTerms = response.content ?? [];
  } catch (error) {
    console.error("Error fetching cancellation terms:", error);
  }

  try {
    const response = await getBookingTerms();
    bookingTerms = response.content ?? [];
  } catch (error) {
    console.error("Error fetching booking terms:", error);
  }

  try {
    const response = await getPaymentTerms();
    paymentTerms = response.content ?? [];
  } catch (error) {
    console.error("Error fetching payment terms:", error);
  }

  return (
    <WrapperContainer
      className="bg-background min-h-screen rounded-2xl"
      exceedNav
    >
      <HashAnchorScroller offset={100} />
      <div className="px-4 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              الشروط والأحكام
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            يرجى قراءة الشروط والأحكام التالية بعناية قبل استخدام خدماتنا.
          </p>
          <Separator className="mt-4" />
        </div>

        <div className="flex flex-col gap-6">
          <Card id="booking-terms" className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  شروط الحجز
                </CardTitle>
                {bookingTerms.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {bookingTerms.length} بند
                  </Badge>
                )}
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="pt-0">
              {bookingTerms.length > 0 ? (
                <div className="divide-y divide-border">
                  {bookingTerms.map((term) => (
                    <TermSection key={term.termsId} term={term} />
                  ))}
                </div>
              ) : (
                <EmptyState message="لا توجد شروط متاحة حاليًا." />
              )}
            </CardContent>
          </Card>

          <Card id="payment-terms" className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <HandCoins className="w-4 h-4" />
                  شروط الدفع
                </CardTitle>
                {paymentTerms.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {cancelationTerms.length} بند
                  </Badge>
                )}
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="pt-0">
              {paymentTerms.length > 0 ? (
                <div className="divide-y divide-border">
                  {paymentTerms.map((term) => (
                    <TermSection key={term.termsId} term={term} />
                  ))}
                </div>
              ) : (
                <EmptyState message="لا توجد شروط متاحة حاليًا." />
              )}
            </CardContent>
          </Card>

          <Card
            id="cancelation-terms"
            className="border border-border shadow-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Ban className="w-4 h-4 text-destructive" />
                  شروط الإلغاء
                </CardTitle>
                {cancelationTerms.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {cancelationTerms.length} بند
                  </Badge>
                )}
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="pt-0">
              {cancelationTerms.length > 0 ? (
                <div className="divide-y divide-border">
                  {cancelationTerms.map((term) => (
                    <TermSection key={term.termsId} term={term} />
                  ))}
                </div>
              ) : (
                <EmptyState message="لا توجد شروط متاحة حاليًا." />
              )}
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          باستخدامك لخدماتنا، فإنك توافق على جميع الشروط والأحكام المذكورة
          أعلاه.
        </p>
      </div>
    </WrapperContainer>
  );
};

export default Page;
