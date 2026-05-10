import Image from "next/image";

interface IUserPointsWalletProps {
  icon: string;
  number: number | string;
  extraIcon?: React.ReactNode;
}

const UserPointsWallet = ({
  icon,
  number,
  extraIcon,
}: IUserPointsWalletProps) => {
  return (
    <div className="bg-Grey100 rounded-full flex items-center py-0.5 px-3 gap-1 line-clamp-1 text-ellipsis">
      <Image src={icon} alt="icon" width={20} height={20} />
      <p className="text-sm">{number}</p>
      {extraIcon}
    </div>
  );
};

export default UserPointsWallet;
