"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { Globe, Mail, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/uploadImages/uploadImage.service";

import { Input, PhoneInput } from "@/app/(components)";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { Separator } from "@/app/(components)/ui/separator";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

interface StepTwoProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
  trigger: UseFormTrigger<ReservationFormValues>;
}

const StepTwo = ({ control, errors, setValue, trigger }: StepTwoProps) => {
  const { formData, setFormField } = useBookedCarDetailsStore();

  const {
    mutateAsync: doUploadImage,
    isPending,
    error: uploadError,
  } = useMutation({
    mutationFn: uploadImage,
  });

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
                onChange={(val) => {
                  field.onChange(val);
                  if (errors.phoneNumber) {
                    trigger("phoneNumber");
                  }
                }}
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
              name="licenseImage"
              control={control}
              render={({ field }) => (
                <InputFileUpload
                  {...field}
                  label="صورة الرخصة"
                  placeholder="أدخل صورة الرخصة"
                  initialFile={formData.licenseImageFile}
                  onFileChange={async (file) => {
                    // Save File in store so preview survives step navigation
                    setFormField("licenseImageFile", file);

                    if (file) {
                      try {
                        const uploadedImageName = await doUploadImage(file);
                        // Save in RHF form
                        setValue("licenseImage", uploadedImageName, {
                          shouldValidate: true,
                        });
                        // Save string in store
                        setFormField("licenseImage", uploadedImageName);
                      } catch (err) {
                        console.error("Upload failed", err);
                      }
                    } else {
                      setValue("licenseImage", "", { shouldValidate: true });
                      setFormField("licenseImage", "");
                    }
                  }}
                />
              )}
            />
            {isPending && (
              <p className="mt-2 text-blue-500 text-sm">جاري رفع الصورة...</p>
            )}
            {uploadError && (
              <p className="mt-2 text-red-500 text-sm">
                {(uploadError as Error).message || "حدث خطأ أثناء رفع الصورة"}
              </p>
            )}
            {errors.licenseImage?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.licenseImage?.message)}
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
