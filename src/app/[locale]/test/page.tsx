import { Button } from "@/app/(components)";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";

const page = async () => {
  return (
    <WrapperContainer exceedNav>
      <Button className="bg-[linear-gradient(180deg,#BE2326_0%,#581012_100%)]">
        Click me
      </Button>
    </WrapperContainer>
  );
};

export default page;
