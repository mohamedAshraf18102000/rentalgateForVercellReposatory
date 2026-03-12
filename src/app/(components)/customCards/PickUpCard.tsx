import Image from "next/image";

interface PickUpCardProps {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
}

const PickUpCard = ({
  title,
  description,
  image,
  onClick,
}: PickUpCardProps) => {
  return (
    <div className="w-full" onClick={onClick}>
      <div className="w-full h-full pb-5 rounded-[18px] cursor-pointer group hover:bg-white transition-all duration-300">
        <img
          src={image}
          alt="bgApp2"
          className="w-full border-white rounded-[18px] border-3 shadow-lg"
        />
        <div className="group-hover:p-2 transition-all duration-300">
          <p className="text-primary font-bold text-2xl my-4">{title}</p>
          <p className="text-Grey700 text-sm font-normal">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PickUpCard;
