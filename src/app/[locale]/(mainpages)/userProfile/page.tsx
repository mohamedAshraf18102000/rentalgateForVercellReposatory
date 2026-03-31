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
import { useEffect } from "react";
import Points from "./components/Points";

const page = () => {
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
      label: "الأسم:",
      userDetails: storeUserData?.clientName,
    },
    {
      icon: "/profile/MailIcon.png",
      label: "البريد الالكتروني:",
      userDetails: storeUserData?.email,
    },
    {
      icon: "/profile/ContactIcon.png",
      label: "رقم الهاتف:",
      userDetails: storeUserData?.mobile,
    },
  ];

  if (!isClient || isLoading) {
    return (
      <WrapperContainer exceedNav>
        <ProfileBreadCrump />
        <div className="w-full p-3 mt-6 h-[500px]">
          <div className=" bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center min-h-[300px]">
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

      <div className="w-full p-3 mt-6 flex justify-between ">
        <div className="w-[60%] bg-white rounded-2xl shadow-lg p-3">
          <div className="grid grid-cols-2 items-center">
            <div className="flex items-center gap-3">
              <div className="w-[100px] h-[100px] relative rounded-2xl overflow-hidden bg-[#BE2326]">
                <Image
                  className="object-fill scale-120"
                  src="https://www.shutterstock.com/image-photo/portrait-phot-saudi-guy-profissional-600w-2603387181.jpg"
                  alt="userImage"
                  fill
                />
              </div>
              <h2 className="text-lg font-bold">
                أهلاً {storeUserData?.clientName || ""}
              </h2>
            </div>
            <Points />
          </div>
          <Separator className="my-2" />
          <div>
            <p className="text-base mb-2">البيانات الشخصية:</p>
            <div className="grid grid-cols-2">
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
            <p className="text-base mb-2">البيانات الأخرى:</p>
            <div className="grid grid-cols-2 items-center gap-4">
              <OtherDetailsAction />
            </div>
          </div>
        </div>

        <div className="w-[40%] rounded-2xl p-3">
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
