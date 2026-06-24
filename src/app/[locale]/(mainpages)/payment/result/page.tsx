import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";

const page = () => {
  return (
    <WrapperContainer exceedNav>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Payment Result</h1>
      </div>
    </WrapperContainer>
  );
};

export default page;
