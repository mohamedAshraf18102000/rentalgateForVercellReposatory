"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import ProfileBreadCrump from "./components/ProfileBreadCrump";
import { Separator } from "@/app/(components)/ui/separator";
import UserDetailsCard from "./components/UserDetailsCard";
import UserReferal from "./components/UserReferal";
import UserProfileActions from "./components/actions/UsersProfileActions";
import OtherDetailsAction from "./components/otherDetails/OtherDetailsAction";
import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";
import { useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Points_WalletCard from "./components/Points_WalletCard";
import { useUserPoints } from "@/hooks/api/useUserPoints";
import { useWalletInfo } from "@/hooks/api/useWalletInfo";
import { normalizeImageUrl } from "@/util";
import UserImage from "./components/userProfileImage/UserImage";

const Page = () => {
  const { data: wallet, isLoading: walletLoading } = useWalletInfo();

  const { data: pointsData, isLoading: userPointsLoading } = useUserPoints();
  const t = useTranslations("profile.profilePage");
  const {
    userData: storeUserData,
    authenticated,
    isClient,
    isLoading,
  } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (isClient && !authenticated) {
      router.replace("/");
    }
  }, [isClient, authenticated, router]);

  if (isClient && !authenticated) return null;

  const userData = [
    {
      icon: "/profile/NameIcon.png",
      label: t("nameLabel"),
      userDetails: storeUserData?.clientName,
    },
    {
      icon: "/profile/MailIcon.png",
      label: t("emailLabel"),
      userDetails: storeUserData?.email,
    },
    {
      icon: "/profile/ContactIcon.png",
      label: t("phoneLabel"),
      userDetails: storeUserData?.mobile,
    },
  ];

  if (!isClient || isLoading) {
    return (
      <WrapperContainer exceedNav>
        <ProfileBreadCrump />
        <div className="mt-4 min-h-[280px] w-full p-2 sm:mt-6 sm:min-h-[320px] sm:p-3">
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl bg-white p-4 shadow-lg sm:min-h-[300px] sm:p-6">
            <div className="flex animate-pulse flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-slate-200"></div>
              <div className="mt-4 h-4 w-48 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer exceedNav>
      <ProfileBreadCrump />

      <div className="mt-4 flex w-full min-w-0 flex-col gap-4 p-2 sm:mt-6 sm:p-3 xl:flex-row xl:items-start">
        <div className="w-full min-w-0 rounded-2xl bg-white p-3 shadow-lg sm:p-4 lg:p-5 xl:w-[60%]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <UserImage
                avatarSrc={normalizeImageUrl(
                  storeUserData?.profileImage,
                  "/profile/userFallbackImage.webp",
                )}
                avatarKey={"profileImage"}
              />
              <h2 className="min-w-0 wrap-break-word text-base font-bold leading-snug sm:text-lg">
                {t("greeting", {
                  name: storeUserData?.clientName || "",
                })}
              </h2>
            </div>
            <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:max-w-[65%]">
              {/* <Points /> */}
              <Points_WalletCard
                loading={userPointsLoading}
                containerClassName="bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)]"
                icon="/profile/coin.png"
                pointsTitle={t("pointsLabel")}
                numberOfPoints={pointsData?.availablePoints ?? 0}
                valueINRial={Number(
                  pointsData?.availablePointsValue?.toFixed(2) ?? 0,
                )}
              />
              <Points_WalletCard
                loading={walletLoading}
                containerClassName="bg-[linear-gradient(180deg,#626060_0%,#050101_100%)] cursor-pointer"
                icon="/profile/actionIcons/wallet.webp"
                valueINRial={Number(wallet?.balance?.toFixed(2) ?? 0)}
                pointsTitle={t("walletBalanceLabel")}
                onClick={() => router.push("/wallet")}
              />
            </div>
          </div>
          <Separator className="my-2" />
          <div>
            <p className="text-base mb-2">{t("personalDataTitle")}</p>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              {userData.map((item, index) => (
                <UserDetailsCard
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  userDetails={item.userDetails || ""}
                />
              ))}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="">
            <p className="text-base mb-2">{t("otherDataTitle")}</p>
            <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 sm:gap-4">
              <OtherDetailsAction />
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 xl:w-[40%]">
          <UserReferal />
          <div className="mt-4 flex flex-col gap-4">
            <UserProfileActions />
          </div>
        </div>
      </div>
    </WrapperContainer>
  );
};

export default Page;
