"use client";

import * as React from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./UserMenu";
import { LoginButton } from "../../LoginButton";
import { ContactUsDialog } from "@/app/(components)/ContactUsDialog";
import { BUTTON_STYLES, NAVBAR_STYLES } from "../constants";
import { useHeaderLogic } from "../hooks/useHeaderLogic";
import { LocationTrigger } from "./LocationTrigger";

interface NavbarActionsProps {
  translations: {
    profile: string;
    userNavGreeting: string;
    myBookings: string;
    logout: string;
    login: string;
    home: string;
    talkToUs: string;
    updateLocationPrefix: string;
    updateLocationLink: string;
    updateLocationSuffix: string;
    selectPickupLocation: string;
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
    handleLogout,
    handleProfileClick,
    handleBookingsClick,
  } = useHeaderLogic();

  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);

  return (
    <>
      <div className={NAVBAR_STYLES.actionsWrapper}>
        <LocationTrigger translations={translations} />

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
