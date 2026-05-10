"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import ProfileBreadCrump from "./components/ProfileBreadCrump";
import Image from "next/image";
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
import { ImagePlus, MessageCircleIcon } from "lucide-react";
import UserImage from "./components/userProfileImage/UserImage";

const page = () => {
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

  const profileImageRaw = storeUserData?.profileImage;
  const computedAvatarSrc = profileImageRaw?.trim()
    ? normalizeImageUrl(String(profileImageRaw).trim())
    : "/profile/userFallbackImage.webp";

  /** Increments when the profile picture is saved so the image URL changes and caches refresh. */
  const [profileImageNonce, setProfileImageNonce] = useState(0);

  const avatarSrcResolved =
    profileImageNonce === 0
      ? computedAvatarSrc
      : `${computedAvatarSrc}${computedAvatarSrc.includes("?") ? "&" : "?"}rev=${profileImageNonce}`;

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
        <div className="w-full p-2 sm:p-3 mt-4 sm:mt-6 min-h-[280px] sm:min-h-[320px]">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex justify-center items-center min-h-[240px] sm:min-h-[300px]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-slate-200 h-20 w-20"></div>
              <div className="h-4 bg-slate-200 rounded w-48 mt-4"></div>
            </div>
          </div>
        </div>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer exceedNav>
      <ProfileBreadCrump />

      <div className="mt-4 sm:mt-6 flex w-full min-w-0 flex-col gap-4 p-2 sm:p-3 lg:flex-row lg:justify-between lg:items-start">
        <div className="w-full min-w-0 rounded-2xl bg-white p-3 shadow-lg sm:p-4 lg:w-[60%]">
          <div className="flex justify-between items-stretch gap-4 lg:grid-cols-2 lg:items-center">
            <div className="flex min-w-0 flex-row h-full items-center gap-3 sm:flex-row md:items-center sm:justify-items-start">
              <UserImage
                avatarSrc={avatarSrcResolved}
                avatarKey={`${String(profileImageRaw ?? "")}-${profileImageNonce}`}
                onProfileImageSaved={() =>
                  setProfileImageNonce((n) => n + 1)
                }
              />
              <h2 className="min-w-0 wrap-break-word text-base font-bold sm:text-lg">
                {t("greeting", {
                  name: storeUserData?.clientName || "",
                })}
              </h2>
            </div>
            <div className="flex gap-2 w-[65%]">
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
                pointsTitle="رصيد المحفظة"
                onClick={() => router.push("/wallet")}
              />
            </div>
          </div>
          <Separator className="my-2" />
          <div>
            <p className="text-base mb-2">{t("personalDataTitle")}</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
            <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 sm:gap-4">
              <OtherDetailsAction />
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 rounded-2xl p-2 sm:p-3 lg:w-[40%]">
          <UserReferal />
          <div className="flex flex-col gap-4 mt-4">
            <UserProfileActions />
          </div>
        </div>
      </div>
    </WrapperContainer>
  );
};

export default page;
