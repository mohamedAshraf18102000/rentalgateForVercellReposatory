import { SaudiRiyalIcon } from "lucide-react";
import { Transaction } from "@/types/wallet/wallet";
import { useLocale, useTranslations } from "next-intl";
import { getWalletTransactionTypeLabel } from "@/lib/wallet/transactionTypeLabel";

type Props = {
  transaction: Transaction;
};

const VoucherCard = ({ transaction }: Props) => {
  const t = useTranslations("profile.walletPage");
  const locale = useLocale();
  const isPositive = transaction.amount >= 0;

  const formattedDateTime = (() => {
    const date = new Date(transaction.createdAt);
    if (Number.isNaN(date.getTime())) return transaction.createdAt;

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  })();

  const description =
    transaction.description || t("defaultTransactionDescription");

  return (
    <div className="border-2 w-full bg-white flex items-start gap-5 rounded-2xl relative overflow-hidden min-h-[150px]">
      <div className="w-[30%] h-full bg-[url(/offers/offerImage2.png)] bg-cover bg-center bg-no-repeat flex items-end ">
        {/* <p className="text-center w-full bg-StatusGreen/95 py-1 font-bold text-StatusDarkGreen">
          <span className="text-sm">{formattedTime}</span>
        </p> */}
      </div>
      <div className="w-[70%] p-3 ">
        <div className="flex justify-between items-center">
          <p className="text-sm text-Grey700 truncate w-1/2">
            <span>رقم الحجز: </span>
            <span className="mx-1">
              {transaction.reservationId ?? "لا يوجد"}
            </span>
          </p>
          <p
            className={`border-2 px-3 py-1 rounded-xl flex items-center justify-center min-w-[30%] ${isPositive ? "bg-StatusGreen border-StatusDarkGreen text-StatusDarkGreen" : "bg-red-50 border-red-500 text-red-600"}`}
          >
            <span className="text-sm font-extrabold" dir="ltr">
              {isPositive ? "+" : ""}
              {transaction.amount.toFixed(2)}
            </span>
            <SaudiRiyalIcon className="w-3 h-3 mr-1" />
          </p>
        </div>

        <p className="text-base! font-bold truncate mt-2" title={description}>
          {getWalletTransactionTypeLabel(transaction.transactionType, t)}
        </p>
        <p className="mt-2">{formattedDateTime}</p>
      </div>
    </div>
  );
};

export default VoucherCard;
