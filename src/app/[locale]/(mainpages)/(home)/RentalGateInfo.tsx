import RentalInfoCard from "@/app/(components)/customCards/RentalInfoCard";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { getTranslations } from "next-intl/server";

const RentalGateInfo = async () => {
  const t = await getTranslations("home");
  const rentalInfoCardDetails = [
    {
      key: "flexibleRental",
      title: t("rentalInfo.flexibleRental.title"),
      description: t("rentalInfo.flexibleRental.description"),
      image: "/rentalInfo/Group.png",
    },
    {
      key: "customerService",
      title: t("rentalInfo.customerService.title"),
      description: t("rentalInfo.customerService.description"),
      image: "/rentalInfo/Group.png",
    },
    {
      key: "locations",
      title: t("rentalInfo.locations.title"),
      description: t("rentalInfo.locations.description"),
      image: "/rentalInfo/Group3.png",
    },
  ];

  return (
    <WrapperContainer className="mb-10 md:mb-16">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {rentalInfoCardDetails.map((card) => (
          <RentalInfoCard
            key={card.key}
            title={card.title}
            description={card.description}
            image={card.image}
          />
        ))}
      </div>
    </WrapperContainer>
  );
};

export default RentalGateInfo;
