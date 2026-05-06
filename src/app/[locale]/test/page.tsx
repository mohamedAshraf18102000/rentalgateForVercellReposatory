"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import useUserAddreses from "@/hooks/api/useUserAddreses";
import React from "react";

const page = () => {
  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useUserAddreses();
  return (
    <WrapperContainer exceedNav>
      <div>
        <h1>User Addresses</h1>
        <pre>{JSON.stringify(userAddresses, null, 2)}</pre>
      </div>
    </WrapperContainer>
  );
};

export default page;
