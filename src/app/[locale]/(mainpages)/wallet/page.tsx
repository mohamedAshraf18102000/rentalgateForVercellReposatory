"use client";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import UserReferal from "../userProfile/components/UserReferal";
import WalletInfo from "./components/WalletInfo";
import WalletTransactions from "./components/WalletTransactions";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <section className="mt-4 flex flex-col gap-4 w-fit">
        <div className="flex min-w-0 flex-col h-fit rounded-2xl bg-white p-3 sm:p-4 gap-4">
          <WalletInfo />
          <UserReferal handleWallet />
        </div>
      </section>

      <WalletTransactions />
    </WrapperContainer>
  );
};

export default page;
