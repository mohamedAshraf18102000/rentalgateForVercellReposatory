import Image from "next/image";

const RentalInfoCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <div className="bg-white flex rounded-2xl">
      <div className="w-1/4">
        <Image
          src={image}
          alt="bgApp2"
          width={500}
          height={400}
          className="w-full h-full"
        />
      </div>
      <div className="w-3/4 p-3">
        <div>
          <h4 className="font-bold text-lg mb-2">{title}</h4>
          <p className="text-Grey700 text-sm font-normal">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default RentalInfoCard;
