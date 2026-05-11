"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import useUserAddreses from "@/hooks/api/useUserAddreses";
import { useRemoveAccountMutation } from "./disable";

const page = () => {
  const { data: userAddresses, isLoading: isLoadingAddresses } =
    useUserAddreses();

  const { mutate: removeAccount, isSuccess: isSuccessRemoveAccount } =
    useRemoveAccountMutation();

  const handleRemoveAccount = () => {
    removeAccount();
  };

  return (
    <WrapperContainer exceedNav>
      <div>
        <h1>User Addresses</h1>
        <pre>{JSON.stringify(userAddresses, null, 2)}</pre>

        <button onClick={handleRemoveAccount}>Remove account</button>
      </div>
    </WrapperContainer>
  );
};

export default page;
