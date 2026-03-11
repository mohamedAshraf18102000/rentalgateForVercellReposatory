import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { Input } from "@/app/(components)/ui/input";
import { UserRound } from "lucide-react";

const ResponsiblePersonForm = () => {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <Input
        id="name"
        type="text"
        placeholder="ادخل الاسم"
        label="اسم المسئول:"
        className="bg-white! border-2! border-Grey400! rounded-xl! text-base!"
        labelClassName="text-base text-primary"
        startIcon={<UserRound className="text-primary" />}
      />
      <CountryPhone
        inputClassName="bg-white!"
        labelClassName="text-base! text-primary!"
        placeholder={"رقم الجوال:"}
        defaultCountry="sa"
        showValidation={true}
        label={"رقم الجوال:"}
        className=" border-2! border-Grey400! rounded-xl!"
      />
    </div>
  );
};

export default ResponsiblePersonForm;
