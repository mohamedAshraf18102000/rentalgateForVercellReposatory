import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import ProfileBreadCrump from "./components/ProfileBreadCrump";
import Image from "next/image";
import { SaudiRiyal } from "lucide-react";
import { Separator } from "@/app/(components)/ui/separator";
import UserDetailsCard from "./components/UserDetailsCard";
import UserExtraDetailsOccordion from "./components/UserExtraDetailsOccordion";
import UserReferal from "./components/UserReferal";

const userData = [
  {
    icon: "/profile/NameIcon.png",
    label: "الأسم:",
    userDetails: "محمد أحمد عبد السلام",
  },
  {
    icon: "/profile/MailIcon.png",
    label: "البريد الالكتروني:",
    userDetails: "mohamed@gmail.com",
  },
  {
    icon: "/profile/ContactIcon.png",
    label: "رقم الهاتف:",
    userDetails: "0555555555",
  },
];

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <ProfileBreadCrump />

      <div className="bg-red-400 w-full p-3 mt-6 flex justify-between ">
        <div className="w-[50%] bg-white rounded-2xl p-3">
          <div className="grid grid-cols-2 items-center">
            <div className="flex items-center gap-3">
              <div className="w-[100px] h-[100px] relative rounded-2xl overflow-hidden">
                <Image
                  className="object-fill scale-120"
                  src="https://www.shutterstock.com/image-photo/portrait-phot-saudi-guy-profissional-600w-2603387181.jpg"
                  alt="userImage"
                  fill
                />
              </div>
              <h2 className="text-lg font-bold">أهلاً عبد الرحمن</h2>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)] text-white">
              <div className="w-[50px] h-[50px] relative rounded-2xl overflow-hidden">
                <Image
                  className="object-fill scale-120"
                  src="/profile/coin.png"
                  alt="userImage"
                  fill
                />
              </div>

              <div className="">
                <p className="text-base">255 نقطة</p>
                <p className="text-sm">20 نقطة سارية حتى 30-03-2025</p>
              </div>

              <div className="flex items-center text-lg">
                <p>1,200.00</p>
                <SaudiRiyal />
              </div>
            </div>
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
                  userDetails={item.userDetails}
                />
              ))}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="">
            <p className="text-base mb-2">البيانات الأخرى:</p>
            <div className="grid grid-cols-2 items-center gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <UserExtraDetailsOccordion
                  key={index}
                  icon="/Profile/ContactIcon.png"
                  title="بيانات الرخصة"
                  content={<p>Mohamed</p>}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-[40%] bg-green-400 rounded-2xl p-3">
          <UserReferal referalCode="MO123MO" />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default page;
