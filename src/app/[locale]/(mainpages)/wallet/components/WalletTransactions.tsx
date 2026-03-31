"use client";

import { Transaction } from "@/types/wallet/wallet";
import VoucherCard from "./VoucherCard";
import { useWalletTransactions } from "@/hooks/api/useWalletTransactions";
import { Skeleton } from "@/app/(components)/ui/skeleton";

const WalletTransactions = () => {
  const { data: response, isLoading, isError } = useWalletTransactions();
  const transactions: Transaction[] = response?.content || [];

  if (isLoading) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-5 w-[30%]" />
            <Skeleton className="h-30 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <section className="w-full mt-8 flex justify-center">
        <p className="my-2 font-bold text-red-500">
          حدث خطأ أثناء تحميل العمليات.
        </p>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="w-full mt-8">
        <p className="my-2 font-bold text-center text-Grey500">
          لا يوجد عمليات لعرضها
        </p>
      </section>
    );
  }

  const groupedTransactions = transactions.reduce(
    (acc, current) => {
      const date = new Date(current.createdAt);
      const dateString = new Intl.DateTimeFormat("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);

      if (!acc[dateString]) acc[dateString] = [];
      acc[dateString].push(current);

      return acc;
    },
    {} as Record<string, Transaction[]>,
  );

  return (
    <section className="w-full mt-8">
      {Object.entries(groupedTransactions).map(([date, items]) => (
        <div key={date} className="mb-6">
          <p className="my-2 font-bold">{date}:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((item) => (
              <VoucherCard key={item.transactionId} transaction={item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default WalletTransactions;
