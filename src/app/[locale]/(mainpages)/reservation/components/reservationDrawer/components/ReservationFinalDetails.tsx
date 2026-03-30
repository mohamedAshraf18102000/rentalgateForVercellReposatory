import { SaudiRiyal } from "lucide-react";

const ReservationFinalDetailsItem = ({
  itemHeader,
  items,
}: {
  itemHeader?: string;
  items: { label: string; value: string | number }[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      {itemHeader && <p className="text-base font-bold">{itemHeader}</p>}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-base"
          >
            <p className="font-medium text-Grey700">{item.label}</p>
            <div className="flex items-center gap-1">
              <p>{item.value}</p>
              <SaudiRiyal className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReservationFinalDetails = () => {
  return (
    <div className="flex flex-col gap-6">
      <ReservationFinalDetailsItem
        itemHeader="تكلفة مدة الإيجار:"
        items={[
          { label: "سعر الإيجار اليومي", value: "500" },
          { label: "سعر الساعات الأضافية", value: "50" },
        ]}
      />
      <ReservationFinalDetailsItem
        itemHeader="تكلفة الخدمات:"
        items={[
          { label: "سائق خاص", value: "500" },
          { label: "كرسي أطفال", value: "50" },
          { label: "تأمين شامل", value: "50" },
        ]}
      />

      <ReservationFinalDetailsItem
        itemHeader="الخصومات و العروض"
        items={[
          { label: "خصم 10%", value: "500" },
          { label: "خصم (أستبدال 500 نقطة)", value: "50" },
          { label: "كود خصم", value: "50" },
        ]}
      />
    </div>
  );
};

export default ReservationFinalDetails;
