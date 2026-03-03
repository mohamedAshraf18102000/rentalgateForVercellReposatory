import PickUpCard from "@/app/(components)/customCards/PickUpCard";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { DialogWrapper } from "@/app/(components)/ui/dialog-wrapper";
import CarPickupDialogTabs from "@/app/(components)/carPickupDialogComponent/CarPickupDialogTabs";

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
          content={<CarPickupDialogTabs customDefaultValue="currentLocation" />}
          footer={
            <div className="w-full flex items-center justify-end gap-2  mt-2">
              <button className=" py-3 text-primary font-normal w-fit px-2 underline underline-offset-3">
                إغلاق
              </button>

              <button className="rounded-[12px] py-3 bg-primary text-white font-bold w-fit px-5">
                أظهار النتائج
              </button>
            </div>
          }
        />
      </WrapperContainer>
    </>
  );
};

export default PickUpArea;
