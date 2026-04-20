"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
  useWatch,
} from "react-hook-form";
import { IdCard, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/uploadImages/uploadImage.service";

import { Input } from "@/app/(components)";
import { Separator } from "@/app/(components)/ui/separator";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";

interface StepTwoProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
  trigger: UseFormTrigger<ReservationFormValues>;
}

const StepTwo = ({ control, errors, setValue }: StepTwoProps) => {
  const { formData, setFormField } = useBookedCarDetailsStore();

  console.log(errors);

  const residenceTypeStr = useWatch({ control, name: "idNumber" });

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
            name="OtherPersonName"
            control={control}
            rules={{ required: "يجب إدخال الاسم" }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                label="الاسم:"
                startIcon={<User className="size-4" />}
                placeholder="أدخل الاسم"
                errorMessage={errors.OtherPersonName?.message}
              />
            )}
          />
        </div>

        <div className="col-span-1">
          <Controller
            name="OtherPersonPhoneNumber"
            control={control}
            render={({ field }) => (
              <div>
                <CountryPhone
                  className={`${errors.OtherPersonPhoneNumber?.message ? "border border-red-600! rounded-xl!" : ""}`}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="أدخل الهاتف"
                  defaultCountry="sa"
                  showValidation={true}
                  label="رقم الجوال"
                  withoutValidations={true}
                />
                {errors.OtherPersonPhoneNumber && (
                  <p className="text-StatusRedBG! text-sm">
                    {String(errors.OtherPersonPhoneNumber?.message)}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="col-span-1">
          <Controller
            name="OtherPersonalId"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                value={field.value ?? ""}
                label="رقم الهوية"
                startIcon={<IdCard className="size-4" />}
                placeholder="أدخل رقم الهوية"
                errorMessage={errors.OtherPersonalId?.message}
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
              name="OtherPersonLicenseImage"
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
                        setValue("OtherPersonLicenseImage", uploadedImageName, {
                          shouldValidate: true,
                        });
                        // Save string in store
                        setFormField("licenseImage", uploadedImageName);
                      } catch (err) {
                        console.error("Upload failed", err);
                      }
                    } else {
                      setValue("OtherPersonLicenseImage", "", {
                        shouldValidate: true,
                      });
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
              <p className="mt-2 text-StatusRedBG! text-sm">
                {(uploadError as Error).message || "حدث خطأ أثناء رفع الصورة"}
              </p>
            )}
            {errors.OtherPersonLicenseImage?.message && (
              <p className="text-StatusRedBG! text-sm">
                {String(errors.OtherPersonLicenseImage?.message)}
              </p>
            )}
          </div>
          <div />
        </div>
      </div>
    </>
  );
};

export default StepTwo;
