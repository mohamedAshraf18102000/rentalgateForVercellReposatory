import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { Input } from "@/app/(components)/ui/input";
import { UserRound } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

const ResponsiblePersonForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mt-8 flex flex-col gap-3">
      <div>
        <Input
          id="responsableName"
          type="text"
          placeholder="ادخل الاسم"
          label="اسم المسئول:"
          className={`bg-white! border-2! rounded-xl! text-base! ${errors.responsableName ? "border-red-500!" : "border-Grey400!"}`}
          labelClassName="text-base text-primary"
          startIcon={<UserRound className="text-primary" />}
          {...register("responsableName")}
        />
        {errors.responsableName && (
          <span className="text-red-500 text-sm">
            {errors.responsableName.message as string}
          </span>
        )}
      </div>

      <Controller
        name="responsableMobile"
        control={control}
        render={({ field }) => (
          <div>
            <CountryPhone
              inputClassName="bg-white!"
              labelClassName="text-base! text-primary!"
              placeholder={"رقم الجوال:"}
              defaultCountry="sa"
              showValidation={true}
              label={"رقم الجوال:"}
              className={`border-2! rounded-xl! ${errors.responsableMobile ? "border-red-500!" : "border-Grey400!"}`}
              value={field.value}
              onChange={field.onChange}
            />
            {errors.responsableMobile && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.responsableMobile.message as string}
              </span>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ResponsiblePersonForm;
