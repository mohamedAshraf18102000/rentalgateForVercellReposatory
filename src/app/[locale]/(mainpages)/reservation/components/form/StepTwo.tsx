"use client";

import { Control, Controller, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Globe, Mail, Phone } from "lucide-react";

import { Input, PhoneInput } from "@/app/(components)";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { Separator } from "@/app/(components)/ui/separator";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useReservationFormStore } from "@/lib/stores/useReservationFormStore";

interface StepTwoProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
}

const StepTwo = ({ control, errors, setValue }: StepTwoProps) => {
  const { formData, setFormField } = useReservationFormStore();
  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-1">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="الاسم الكامل"
                placeholder="أدخل الاسم الرباعي"
                errorMessage={errors.fullName?.message}
              />
            )}
          />
        </div>
        <div className="col-span-1">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                defaultCountry="sa"
                inputClassName="w-full"
                label="رقم الجوال"
                labelIcon={<Phone className="size-4" />}
                placeholder="05xxxxxxxx"
                errorMessage={errors.phoneNumber?.message}
              />
            )}
          />
        </div>
        <div className="col-span-1">
          <Controller
            name="idNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="نوع الإقامة:"
                placeholder="أدخل نوع الإقامة"
                errorMessage={errors.idNumber?.message}
              />
            )}
          />
        </div>
        <div className="col-span-1">
          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="الجنسية:"
                startIcon={<Globe className="size-4" />}
                placeholder="أدخل الجنسية"
                errorMessage={errors.nationality?.message}
              />
            )}
          />
        </div>
        <div className="col-span-1">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                startIcon={<Mail className="size-4" />}
                label="البريد الإلكتروني"
                placeholder="أدخل البريد الإلكتروني"
                errorMessage={errors.email?.message}
              />
            )}
          />
        </div>
      </div>
      <Separator className="my-4" />

      <div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Controller
              name="licenceImage"
              control={control}
              render={({ field }) => (
                <InputFileUpload
                  {...field}
                  label="صورة الرخصة"
                  placeholder="أدخل صورة الرخصة"
                  initialFile={formData.licenceImage}
                  onFileChange={(file) => {
                    // Save in RHF form
                    setValue("licenceImage", file ?? undefined, { shouldValidate: true });
                    // Save in store so it survives step navigation
                    setFormField("licenceImage", file);
                  }}
                />
              )}
            />
            {errors.licenceImage?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.licenceImage?.message)}
              </p>
            )}
          </div>
          <div />
          <div>
            <Controller
              name="licenceExpiryDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  placeholder="ادخل تاريخ الأنتهاء"
                  label="تاريخ انتهاء الرخصة:"
                />
              )}
            />
            {errors.licenceExpiryDate?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.licenceExpiryDate?.message)}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StepTwo;
