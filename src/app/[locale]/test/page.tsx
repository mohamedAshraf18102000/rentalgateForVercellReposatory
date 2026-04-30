"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { WelcomePointsDialog } from "@/app/(components)/WelcomePointsDialog";

const Page = () => {
  const [open, setOpen] = useState(true);
  const params = useParams();
  const locale = (params.locale as string) || "ar";

  return (
    <WrapperContainer exceedNav>
      <WelcomePointsDialog
        open={open}
        onOpenChange={setOpen}
        points={10}
        locale={locale}
      />
    </WrapperContainer>
  );
};

export default Page;
