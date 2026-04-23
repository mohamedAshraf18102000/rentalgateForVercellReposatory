import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <div className="bg-red-400 w-full min-h-[300px] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="border-2 border-black h-fit p-2 flex flex-col gap-2 items-center">
          <div className="w-full p-1 bg-[url(/cars/carCateforyBG.png)] bg-cover bg-center bg-no-repeat rounded-2xl">
            <img
              src="https://viganium.co/uploads/1762342853778.png"
              alt="test"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="login-tab-text text-base">سيدان</span>
        </div>
      </div>
    </WrapperContainer>
  );
};

export default page;
