import Image from "next/image";
import Link from "next/link";

type ReservationSuccessComponentProps = {
  successTitle?: string;
  redirectCountdownText: string;
  goNowLabel: string;
  onNavigateNow: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const ReservationSuccessComponent = ({
  successTitle = "تم الحجز بنجاح",
  redirectCountdownText,
  goNowLabel,
  onNavigateNow,
}: ReservationSuccessComponentProps) => {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <div className="relative h-[80px] w-[80px] rounded-full bg-Grey100">
        <Image src="/bussinesAccounts/dialogeSuccessImage.png" alt="" fill />
      </div>
      <div className="mt-5">
        <p className="text-base! font-bold">{successTitle}</p>
        <p className="mt-2 text-sm text-Grey700">{redirectCountdownText}</p>
        <Link
          href="/myBookings"
          className="my-2 block text-sm text-Grey700 underline underline-offset-5"
          onClick={onNavigateNow}
        >
          {goNowLabel}
        </Link>
      </div>
    </div>
  );
};

export default ReservationSuccessComponent;
