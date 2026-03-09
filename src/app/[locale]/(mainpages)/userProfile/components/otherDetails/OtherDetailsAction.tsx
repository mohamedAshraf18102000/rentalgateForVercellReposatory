"use client";
import ProfileActionCard from "../ProfileActionCard";
import UpdateLicenceDialog from "../userDialog/UpdateLicenceDialog";
import { useState } from "react";
import UpdateUserSavedLocationDialog from "../userDialog/UpdateUserSavedLocationDialog";

const OtherDetailsAction = () => {
  const [openLicenceDialog, setOpenLicenceDialog] = useState(false);
  const [openUserSavedLocDialog, setOpenUserSavedLocDialog] = useState(false);

  return (
    <>
      <ProfileActionCard
        onClick={() => setOpenLicenceDialog(true)}
        bg_gray
        title="بيانات الرخصة"
        description="تعديل بيانات الرخصة"
        icon="/profile/actionIcons/licence.webp"
      />

      <ProfileActionCard
        onClick={() => setOpenUserSavedLocDialog(true)}
        bg_gray
        title="العناوين المسجلة"
        description="الحالي: السعودية, جدة"
        icon="/profile/actionIcons/location.webp"
      />

      <ProfileActionCard
        bg_gray
        title="حجوزاتي"
        description="عرض الحجوزات السابقة"
        icon="/profile/actionIcons/bookings.webp"
      />

      <ProfileActionCard
        bg_gray
        title="المحفظة"
        description="أستبدل النقاط المكتسبة"
        icon="/profile/actionIcons/wallet.webp"
      />

      {/* Dialogs */}
      <UpdateLicenceDialog
        open={openLicenceDialog}
        setOpen={setOpenLicenceDialog}
      />

      <UpdateUserSavedLocationDialog
        open={openUserSavedLocDialog}
        setOpen={setOpenUserSavedLocDialog}
      />
    </>
  );
};

export default OtherDetailsAction;
