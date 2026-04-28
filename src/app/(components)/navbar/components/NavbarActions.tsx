"use client";

import * as React from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./UserMenu";
import { LoginButton } from "../../LoginButton";
import { ContactUsDialog } from "@/app/(components)/ContactUsDialog";
import { BUTTON_STYLES, NAVBAR_STYLES } from "../constants";
import { useHeaderLogic } from "../hooks/useHeaderLogic";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";

interface NavbarActionsProps {
  translations: {
    profile: string;
    myBookings: string;
    logout: string;
    login: string;
    home: string;
    talkToUs: string;
    updateLocationPrefix: string;
    updateLocationLink: string;
    updateLocationSuffix: string;
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

  const pathname = usePathname();

  const [contactDialogOpen, setContactDialogOpen] = React.useState(false);
  const address = useLocationStore((state) => state.address);
  const openLocationDialog = useLocationStore((state) => state.openDialog);

  const ToastError = () => {
    return (
      <span onClick={() => console.log("clicked")}>
        {translations.updateLocationPrefix}{" "}
        <Link className="underline underline-offset-3!" href="/bookings">
          {translations.updateLocationLink}
        </Link>{" "}
        {translations.updateLocationSuffix}
      </span>
    );
  };

  const handleOpenLocationDialog = () => {
    if (pathname.includes("/reservation") || pathname.includes("/carDetails")) {
      toast.error((<ToastError />) as React.ReactNode, {
        position: "top-center",
      });
      return;
    }
    openLocationDialog("navbar");
  };

  return (
    <>
      <div className={NAVBAR_STYLES.actionsWrapper}>
        {address ? (
          <button
            className="underline underline-offset-1 flex items-center gap-1 cursor-pointer hover:bg-Grey100 p-1 rounded-xl transition duration-200"
            title={address?.toString()}
            onClick={handleOpenLocationDialog}
          >
            <span className="scale-90">
              <PositioningIcon />
            </span>
            {address && address?.length > 20
              ? `${address?.slice(0, 20)}...`
              : address}

            <ChevronDown className="w-4 h-4" />
          </button>
        ) : (
          <div
            className="flex items-center gap-1 cursor-pointer hover:bg-Grey100 p-1 rounded-xl transition duration-200"
            onClick={handleOpenLocationDialog}
          >
            <span className="scale-90">
              <PositioningIcon />
            </span>
            <span className="text-sm underline underline-offset-3">
              حدد مكان الاستلام
            </span>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}

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
