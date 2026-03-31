"use client";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { getAuthToken } from "@/util/auth";
import { useEffect, useState } from "react";
import ReservationDrawer from "../(mainpages)/reservation/components/reservationDrawer/ReservationDrawer";

const Page = () => {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setUserToken(token);
  }, []);

  return (
    <WrapperContainer
      exceedNav
      className="p-10 flex flex-col gap-8 max-w-4xl mx-auto"
    >
      <ReservationDrawer open={true} onOpenChange={() => {}} />

      <h1 className="text-3xl font-bold text-gray-800">Token Debug Page</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-blue-600">
          User Authentication Token
        </h2>
        <div className="p-6 bg-blue-50 rounded-xl break-all border border-blue-200 shadow-sm">
          {userToken ? (
            <code className="text-sm font-mono text-blue-900 selection:bg-blue-200">
              {userToken}
            </code>
          ) : (
            <span className="text-amber-600 italic">
              No user token found in cookies (Not logged in)
            </span>
          )}
        </div>
      </section>
    </WrapperContainer>
  );
};

export default Page;
