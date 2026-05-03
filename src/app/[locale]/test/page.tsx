"use client";

import { Button } from "@/app/(components)";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { resetAllStores } from "@/lib/stores/resetAllStores";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const handleResetAllStores = () => {
    resetAllStores();
    router.push("/bookings");
  };
  return (
    <WrapperContainer exceedNav>
      <p>Mohamed</p>
      <Button
        type="button"
        onClick={handleResetAllStores}
        style={{ marginTop: 16 }}
      >
        Reset all stores
      </Button>
    </WrapperContainer>
  );
};

export default Page;
