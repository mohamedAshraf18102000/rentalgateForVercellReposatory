import { useLocale } from "next-intl";

const RentalGateName = () => {
  const locale = useLocale();
  const translations = {
    rental: locale === "ar" ? "رينتال" : "Rental",
    gate: locale === "ar" ? "جــيــت" : "Gate",
  };
  return (
    <div className="flex flex-col justify-center items-start -mx-3">
      <p className="p-0! m-0! font-semibold text-justify ">
        {translations.rental}
      </p>
      <p className="p-0! m-0! font-semibold text-justify -mt-2!">
        {translations.gate}
      </p>
    </div>
  );
};

export default RentalGateName;
