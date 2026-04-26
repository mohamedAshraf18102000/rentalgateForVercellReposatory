import { getTranslations } from "next-intl/server";
import BussinessAccountsContentClient from "@/app/[locale]/(mainpages)/bussinessAccounts/components/BussinessAccountsContentClient";

interface BussinessAccountsContentProps {
  withOutStepper?: boolean;
}

const BussinessAccountsContent = async ({
  withOutStepper = false,
}: BussinessAccountsContentProps) => {
  const t = await getTranslations("companyQuotation");
  const copy = {
    stepper: {
      responsible: {
        title: t("businessAccount.stepper.responsible.title"),
        description: t("businessAccount.stepper.responsible.description"),
      },
      company: {
        title: t("businessAccount.stepper.company.title"),
        description: t("businessAccount.stepper.company.description"),
      },
      notes: {
        title: t("businessAccount.stepper.notes.title"),
        description: t("businessAccount.stepper.notes.description"),
      },
    },
    hero: {
      title: t("businessAccount.hero.title"),
      description: t("businessAccount.hero.description"),
    },
    actions: {
      nextStep: t("businessAccount.actions.nextStep"),
      joinNow: t("businessAccount.actions.joinNow"),
    },
  };

  return (
    <BussinessAccountsContentClient
      withOutStepper={withOutStepper}
      copy={copy}
    />
  );
};

export default BussinessAccountsContent;
