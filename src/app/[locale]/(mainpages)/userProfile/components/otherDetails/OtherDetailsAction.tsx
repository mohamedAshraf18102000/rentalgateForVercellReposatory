"use client";
import ProfileActionCard from "../ProfileActionCard";
import UpdateLicenceDialog from "../userDialog/UpdateLicenceDialog";
import { useState } from "react";
import UpdateUserSavedLocationDialog from "../userDialog/UpdateUserSavedLocationDialog";
import Link from "next/link";
import { useTranslations } from "next-intl";
import UpdateUserReservationProfile from "../userDialog/UpdateUserReservationProfile";

const OtherDetailsAction = () => {
  const t = useTranslations("profile.profilePage.otherDetailsActions");
  // const [openLicenceDialog, setOpenLicenceDialog] = useState(false);
  const [openUserSavedLocDialog, setOpenUserSavedLocDialog] = useState(false);
  const [
    openUserReservationProfileDialog,
    setOpenUserReservationProfileDialog,
  ] = useState(false);

  return (
    <>
      {/* <ProfileActionCard
        onClick={() => setOpenLicenceDialog(true)}
        bg_gray
        title={t("licenceTitle")}
        description={t("licenceDescription")}
        icon="/profile/actionIcons/licence.webp"
      /> */}

      <ProfileActionCard
        onClick={() => setOpenUserSavedLocDialog(true)}
        bg_gray
        title={t("savedAddressTitle")}
        description={t("savedAddressDescription")}
        icon="/profile/actionIcons/location.webp"
      />
      <Link href="/myBookings">
        <ProfileActionCard
          bg_gray
          title={t("myBookingsTitle")}
          description={t("myBookingsDescription")}
          icon="/profile/actionIcons/bookings.webp"
        />
      </Link>

      <Link href="/wallet">
        <ProfileActionCard
          bg_gray
          title={t("walletTitle")}
          description={t("walletDescription")}
          icon="/profile/actionIcons/wallet.webp"
        />
      </Link>
      <ProfileActionCard
        bg_gray
        onClick={() => setOpenUserReservationProfileDialog(true)}
        title={t("completeProfileTitle")}
        description={t("completeProfileDescription")}
        icon="/profile/actionIcons/licence.webp"
      />

      {/* Dialogs */}
      {/* <UpdateLicenceDialog
        open={openLicenceDialog}
        setOpen={setOpenLicenceDialog}
      /> */}

      <UpdateUserSavedLocationDialog
        open={openUserSavedLocDialog}
        setOpen={setOpenUserSavedLocDialog}
      />

      <UpdateUserReservationProfile
        open={openUserReservationProfileDialog}
        setOpen={setOpenUserReservationProfileDialog}
      />
    </>
  );
};

export default OtherDetailsAction;
