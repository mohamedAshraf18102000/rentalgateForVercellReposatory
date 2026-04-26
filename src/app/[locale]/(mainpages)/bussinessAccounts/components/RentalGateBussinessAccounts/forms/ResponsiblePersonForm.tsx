import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { Input } from "@/app/(components)/ui/input";
import { UserRound } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

const ResponsiblePersonForm = () => {
  const t = useTranslations("companyQuotation");
  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mt-8 flex flex-col gap-3">
      <div>
        <Input
          id="responsableName"
          type="text"
          placeholder={t("step2.placeholders.name")}
          label={t("step2.fields.name")}
          className={`bg-white! border-2! rounded-xl! text-base! ${errors.responsableName ? "border-red-500!" : "border-Grey400!"}`}
          labelClassName="text-base text-primary"
          startIcon={<UserRound className="text-primary" />}
          {...register("responsableName", {
            onChange: (e) => {
              if (errors.responsableName) {
                trigger("responsableName");
              }
            },
          })}
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
          <>
            <div className="relative z-50 overflow-visible">
              <CountryPhone
                inputClassName="bg-white!"
                labelClassName="text-base! text-primary!"
                placeholder={t("step2.fields.phone")}
                defaultCountry="sa"
                showValidation={false}
                label={t("step2.fields.phone")}
                className={`relative z-50 border-2! rounded-xl! ${errors.responsableMobile ? "border-red-500!" : "border-Grey400!"}`}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  if (errors.responsableMobile) {
                    trigger("responsableMobile");
                  }
                }}
              />
            </div>
            {errors.responsableMobile && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.responsableMobile.message as string}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default ResponsiblePersonForm;
