import { SaudiRiyalIcon } from "lucide-react";
import { Transaction } from "@/types/wallet/wallet";
import { useTranslations } from "next-intl";
import { getWalletTransactionTypeLabel } from "@/lib/wallet/transactionTypeLabel";

type Props = {
  transaction: Transaction;
};

const VoucherCard = ({ transaction }: Props) => {
  const t = useTranslations("profile.walletPage");
  const isPositive = transaction.amount >= 0;

  // Format the date/time string, e.g., 10:30 AM
  const formattedTime = new Date(transaction.createdAt).toLocaleTimeString(
    "ar-EG",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="border-2 w-full bg-white flex items-end gap-5 rounded-2xl relative overflow-hidden">
      <div className="w-[30%] h-full bg-[url(/offers/offerImage2.png)] bg-cover bg-center bg-no-repeat flex items-end ">
        <p className="text-center w-full bg-StatusGreen/95 py-1 font-bold text-StatusDarkGreen">
          <span className="text-sm">{formattedTime}</span>
        </p>
      </div>
      <div className="w-[70%] p-3 ">
        <div className="flex justify-between items-center">
          <p className="text-sm text-Grey700 truncate w-1/2">
            {getWalletTransactionTypeLabel(transaction.transactionType, t)}
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
        <p
          className="text-base! font-bold truncate mt-2"
          title={transaction.description || "معاملة محفظة"}
        >
          {transaction.description || "معاملة محفظة"}
        </p>
        <div className="flex items-center mt-3">
          <span className="text-Grey600">الرصيد المتبقي:</span>
          <span className="font-bold mx-2">
            {transaction.balanceAfter.toFixed(2)}
          </span>
          <SaudiRiyalIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;
