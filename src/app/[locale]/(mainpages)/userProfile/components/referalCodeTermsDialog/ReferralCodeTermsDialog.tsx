import { Button, DialogWrapper } from "@/app/(components)";
import { Coins, Gift, Info, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

interface IReferralTermsProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
const ReferralTerm = ({ icon, title, description }: IReferralTermsProps) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-base font-bold">{title}</h4>
      </div>
      <p className="text-base text-gray-600 mt-1">{description}</p>
    </div>
  );
};

const ReferralCodeTermsDialog = () => {
  const t = useTranslations("profile.referralCodeTermsDialog");
  const [open, setOpen] = useState(false);

  const highlight = (chunks: React.ReactNode) => (
    <span className="font-bold text-StatusRed">{chunks}</span>
  );

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      footer={
        <div className="w-full flex justify-end mt-2">
          <Button
            className="font-bold border-none underline text-base"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            {t("close")}
          </Button>
        </div>
      }
      trigger={<Info size={18} className="cursor-pointer!" />}
      size="lg"
      header={{
        mainTitle: t("title"),
      }}
      content={
        <div className="flex flex-col gap-5">
          <Image
            src="/profile/referralDialogImages/Invitation_code_banner.webp"
            alt={t("imageAlt")}
            width={1000}
            height={1000}
            className="w-full rounded-lg h-[150px]! bg-gray-200 object-cover"
          />
          <ReferralTerm
            icon={<Ticket size={25} className="text-StatusRed" />}
            title={t("terms.shareCode.title")}
            description={t.rich("terms.shareCode.description", { highlight })}
          />

          <ReferralTerm
            icon={<Coins size={25} className="text-StatusRed" />}
            title={t("terms.helpFriends.title")}
            description={t.rich("terms.helpFriends.description", { highlight })}
          />

          <ReferralTerm
            icon={<Gift size={25} className="text-StatusRed" />}
            title={t("terms.enjoyRewards.title")}
            description={t("terms.enjoyRewards.description")}
          />
        </div>
      }
    />
  );
};

export default ReferralCodeTermsDialog;
