import { Transaction } from "@/types/wallet/wallet";
import { SaudiRiyalIcon } from "lucide-react";

type Props = {
  transaction: Transaction;
};

const TransactionCard = ({ transaction }: Props) => {
  // Try to parse the date, or just show it if not parsing correctly
  const formattedTime = new Date(transaction.createdAt).toLocaleTimeString(
    "ar-EG",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="border-2 w-full bg-white p-4 flex flex-col gap-3 rounded-2xl relative overflow-hidden">
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <p className="text-sm font-semibold text-Grey700">
          {transaction.transactionType}
        </p>
        <p className="text-sm text-Grey500">{formattedTime}</p>
      </div>

      <div>
        <p className="text-base font-bold">
          {transaction.description || "معاملة محفظة"}
        </p>
        {transaction.reservationId && (
          <p className="text-sm text-Grey600 mt-1">
            رقم الحجز: {transaction.reservationId}
          </p>
        )}
      </div>

      <div className="flex justify-between items-end mt-2 pt-2">
        <div className="flex flex-col">
          <p className="text-sm text-Grey600">الرصيد بعد العملية</p>
          <div className="flex items-center gap-1 font-bold mt-1">
            <span>{transaction.balanceAfter.toFixed(2)}</span>
            <SaudiRiyalIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-sm text-Grey600">القيمة</p>
          <div
            className={`flex items-center gap-1 font-extrabold text-lg mt-1 ${
              transaction.amount >= 0 ? "text-StatusDarkGreen" : "text-red-500"
            }`}
          >
            <span>
              {transaction.amount > 0 ? "+" : ""}
              {transaction.amount.toFixed(2)}
            </span>
            <SaudiRiyalIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
