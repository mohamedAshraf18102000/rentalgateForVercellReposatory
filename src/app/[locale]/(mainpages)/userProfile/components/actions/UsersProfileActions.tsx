"use client";
import { useState } from "react";
import ProfileActionCard from "../ProfileActionCard";
import UpdatePasswordDialog from "../userDialog/UpdatePasswordDialog";
import UserSuggestionDialog from "../userDialog/UserSuggestionDialog";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

const UserProfileActions = () => {
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openSuggestionDialog, setOpenSuggestionDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    router.push(pathname, { locale: newLocale });
  };

  return (
    <>
      <ProfileActionCard
        onClick={() => setOpenPasswordDialog(true)}
        title="كلمة المرور"
        description="تغيير كلمة المرور الخاصة بك"
        icon="/profile/actionIcons/password.webp"
      />
      <ProfileActionCard
        onClick={handleLanguageChange}
        title="تغيير اللغة"
        description="تغيير اللغة الخاصة بك"
        icon="/profile/actionIcons/language.webp"
      />

      <ProfileActionCard
        onClick={() => setOpenSuggestionDialog(true)}
        title="الدعم و المقترحات"
        description="لا تتردد بالتواصل معنا إذا كان لديك مقترح أو إذا واجهتك مشكلة"
        icon="/profile/actionIcons/customerService.webp"
      />

      {/* Dialogs */}
      <UpdatePasswordDialog
        open={openPasswordDialog}
        setOpen={setOpenPasswordDialog}
      />

      <UserSuggestionDialog
        open={openSuggestionDialog}
        setOpen={setOpenSuggestionDialog}
      />
    </>
  );
};

export default UserProfileActions;
