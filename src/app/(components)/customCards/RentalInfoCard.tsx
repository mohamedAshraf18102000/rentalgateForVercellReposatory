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
    <div className="bg-white flex flex-row items-center rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="w-1/4 sm:w-[22%] md:w-1/4 p-2 flex items-center justify-center">
        <div className="relative aspect-square w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 22vw, 25vw"
          />
        </div>
      </div>
      <div className="w-3/4 sm:w-[78%] md:w-3/4 p-3 md:p-4">
        <div>
          <h4 className="font-bold text-base md:text-lg mb-1 md:mb-2 text-start">
            {title}
          </h4>
          <p className="text-Grey700 text-xs md:text-sm font-normal text-start">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RentalInfoCard;
