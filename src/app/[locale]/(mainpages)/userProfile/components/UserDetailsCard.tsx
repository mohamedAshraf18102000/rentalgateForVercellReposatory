import Image from "next/image";

interface UserDetailsCardProps {
  userDetails: string;
  label: string;
  icon: string;
}

const UserDetailsCard = ({
  userDetails,
  label,
  icon,
}: UserDetailsCardProps) => {
  return (
    <div className="flex flex-col gap-2 p-2 sm:flex-row sm:items-start sm:gap-3">
      <div className="flex items-center gap-3 sm:block sm:w-[45px] sm:shrink-0">
        <div className="relative h-[45px] w-[45px] shrink-0">
          <Image className="object-contain" src={icon} alt="" fill />
        </div>
        <span className="min-w-0 text-base font-normal sm:hidden">{label}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="hidden text-base font-normal sm:block">{label}</span>
        <div className="rounded-xl bg-Grey100 p-2 px-4 text-Grey500">
          <span className="wrap-break-word" dir="ltr">
            {userDetails || ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
