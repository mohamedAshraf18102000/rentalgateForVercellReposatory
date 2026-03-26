"use client";

import * as React from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./UserMenu";
import { LoginButton } from "../../LoginButton";
import { ContactUsDialog } from "@/app/(components)/ContactUsDialog";
import { BUTTON_STYLES, NAVBAR_STYLES } from "../constants";
import { useHeaderLogic } from "../hooks/useHeaderLogic";
import { useLocationStore } from "@/lib/stores/useLocationStore";

interface NavbarActionsProps {
  translations: {
    profile: string;
    myBookings: string;
    logout: string;
    login: string;
    home: string;
    talkToUs: string;
  };
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({
  translations,
}) => {
  const {
    isClient,
    authenticated,
    userData,
    isLoading,
    locale,
    handleLogout,
    handleLanguageChange,
    handleProfileClick,
    handleBookingsClick,
  } = useHeaderLogic();

  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);
  const address = useLocationStore((state) => state.address);
  const openLocationDialog = useLocationStore((state) => state.openDialog);

  return (
    <>
      <div className={NAVBAR_STYLES.actionsWrapper}>
        <button title={address?.toString()} onClick={openLocationDialog}>
          {address && address?.length > 20
            ? `${address?.slice(0, 20)}...`
            : address}
        </button>

        <LanguageSwitcher
          currentLocale={locale}
          onToggle={handleLanguageChange}
        />

        {isClient && authenticated ? (
          <UserMenu
            userData={userData}
            isLoading={isLoading}
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
            onBookingsClick={handleBookingsClick}
            translations={translations}
          />
        ) : (
          <LoginButton className={BUTTON_STYLES.primary} variant="default">
            {translations.login}
          </LoginButton>
        )}
      </div>

      <ContactUsDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </>
  );
};
