import RentalInfoCard from "@/app/(components)/customCards/RentalInfoCard";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";

const rentalInfoCardDetails = [
  {
    key: "flexibleRental",
    title: "عملية استئجار مرنة",
    description: "نقدّم لك بنود استئجار مرنة تتماشى مع احتياجاتك",
    image: "/rentalInfo/Group.png",
  },
  {
    key: "customerService",
    title: "خدمة العملاء متوفرة 24/7",
    description: "نقدّم لك بنود استئجار مرنة تتماشى مع احتياجاتك",
    image: "/rentalInfo/Group.png",
  },
  {
    key: "locations",
    title: "أكثر من 60,000 موقع",
    description: "نقدّم لك بنود استئجار مرنة تتماشى مع احتياجاتك",
    image: "/rentalInfo/Group3.png",
  },
];

const RentalGateInfo = () => {
  return (
    <WrapperContainer>
      <div className="w-3/4 mx-auto grid grid-cols-3 gap-8 mb-8">
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
