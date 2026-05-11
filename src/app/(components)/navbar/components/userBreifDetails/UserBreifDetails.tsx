"use client";

import { normalizeImageUrl } from "@/util";
import { SaudiRiyal } from "lucide-react";
import Image from "next/image";
import UserPointsWallet from "./UserPointsWallet";

interface IUserBreifDetailsProps {
  name: string;
  userImage: string;
  greeting: string;
  availablePoints?: number;
  walletBalance?: number;
}

const truncateName = (value: string, maxLength = 13) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

const UserBreifDetails = ({
  name,
  userImage,
  greeting,
  availablePoints = 0,
  walletBalance = 0,
}: IUserBreifDetailsProps) => {
  const displayName = truncateName(name);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 hover:bg-Grey100 p-1 rounded-lg transition duration-200">
        <Image
          src={normalizeImageUrl(userImage)}
          alt={name}
          width={38}
          height={38}
          className="rounded-lg"
        />
        <div className="text-start text-sm">
          <p className="text-Grey700 font-bold">{greeting}</p>
          <p
            className="font-normal"
            title={name !== displayName ? name : undefined}
          >
            {displayName}
          </p>
        </div>
      </div>
      <div className="text-start text-sm flex flex-col gap-1">
        <UserPointsWallet
          icon={"/profile/coin.png"}
          number={availablePoints}
          extraIcon={<span>نقطة</span>}
        />
        <UserPointsWallet
          icon={"/profile/actionIcons/wallet.webp"}
          number={walletBalance}
          extraIcon={<SaudiRiyal className="w-3 h-3" />}
        />
      </div>
    </div>
  );
};

export default UserBreifDetails;
