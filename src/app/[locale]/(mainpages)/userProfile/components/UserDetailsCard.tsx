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
    <div className="p-2 flex gap-3">
      <div className="w-[45px] h-[45px] relative">
        <Image className="object-contain" src={icon} alt="userImage" fill />
      </div>
      <div className="w-full">
        <span className="text-base font-normal">{label}</span>
        <div className="bg-Grey100 mt-2 p-2 rounded-xl px-4 text-Grey500">
          {userDetails}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
