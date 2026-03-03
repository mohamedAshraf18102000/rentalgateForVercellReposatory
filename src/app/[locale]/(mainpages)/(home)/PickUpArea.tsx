import PickUpCard from "@/app/(components)/customCards/PickUpCard";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { DialogWrapper } from "@/app/(components)/ui/dialog-wrapper";
import CarPickupDialogTabs from "@/app/(components)/carPickupDialogTabs/CarPickupDialogTabs";

const pickupCardDetails = [
  {
    title: "من محطة المطار",
    description: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي",
    image: "/pickupCard/Airport.png",
  },
  {
    title: "من محطة القطار",
    description: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي",
    image: "/pickupCard/Train.png",
  },
  {
    title: "من المعرض",
    description: "كان لوريم إيبسوم ولايزال المعيار للنص الشكلي",
    image: "/pickupCard/Showroom.png",
  },
];

const PickUpArea = () => {
  return (
    <>
      <WrapperContainer className="my-14">
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <h2 className="font-bold text-3xl">مكان الأستلام</h2>
          <p className="text-Grey700 text-base font-normal">
            إينما تكن, سياراتك ستكون في إنتظارك
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full items-center justify-items-center">
          {pickupCardDetails.map((card, index) => (
            <PickUpCard
              key={index}
              title={card.title}
              description={card.description}
              image={card.image}
            />
          ))}
        </div>

        <DialogWrapper
          size="lg"
          trigger={
            <div className="mt-8 cursor-pointer underline text-primary">
              اضغط هنا لمشاهدة مثال للديالوج
            </div>
          }
          header={{
            mainTitle: "مكان الأستلام",
          }}
          extraHeader={<CarPickupDialogTabs />}
          content={
            <div className="space-y-4 ">
              <p>هذا مجرد مثال بسيط لاستخدام مكون الـ DialogWrapper.</p>
              <p>يمكنك وضع أي محتوى تريده هنا.</p>
            </div>
          }
          footer={
            <button className="w-full py-3 bg-red-500 text-white rounded-lg font-bold">
              إغلاق
            </button>
          }
        />
      </WrapperContainer>
    </>
  );
};

export default PickUpArea;
