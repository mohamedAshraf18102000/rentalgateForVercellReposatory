"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { IdCard, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/uploadImages/uploadImage.service";
import { useTranslations } from "next-intl";

import { Input } from "@/app/(components)";
import { Separator } from "@/app/(components)/ui/separator";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";

interface StepTwoProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
  trigger: UseFormTrigger<ReservationFormValues>;
}

const StepTwo = ({ control, errors, setValue }: StepTwoProps) => {
  const t = useTranslations("carDetails");
  const {
    mutateAsync: doUploadImage,
    isPending,
    error: uploadError,
  } = useMutation({
    mutationFn: uploadImage,
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="col-span-1">
          <Controller
            name="OtherPersonName"
            control={control}
            rules={{ required: t("reservation.forOtherStepTwo.nameRequired") }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                label={t("reservation.forOtherStepTwo.nameLabel")}
                startIcon={<User className="size-4" />}
                placeholder={t("reservation.forOtherStepTwo.namePlaceholder")}
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
                  placeholder={t(
                    "reservation.forOtherStepTwo.phonePlaceholder",
                  )}
                  defaultCountry="sa"
                  showValidation={true}
                  label={t("reservation.forOtherStepTwo.phoneLabel")}
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
                label={t("reservation.forOtherStepTwo.personalIdLabel")}
                startIcon={<IdCard className="size-4" />}
                placeholder={t(
                  "reservation.forOtherStepTwo.personalIdPlaceholder",
                )}
                errorMessage={errors.OtherPersonalId?.message}
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="identityExpiryDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                required
                {...field}
                placeholder={"ادخل تاريخ انتهاء الهوية"}
                label={"تاريخ انتهاء الهوية"}
              />
            )}
          />
          {errors.identityExpiryDate?.message && (
            <p className="text-red-500 text-sm">
              {String(errors.identityExpiryDate?.message)}
            </p>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Controller
              name="OtherPersonLicenseImage"
              control={control}
              render={({ field }) => (
                <InputFileUpload
                  InputAsterisk
                  {...field}
                  label={t("reservation.forOtherStepTwo.licenseImageLabel")}
                  placeholder={t(
                    "reservation.forOtherStepTwo.licenseImagePlaceholder",
                  )}
                  onFileChange={async (file) => {
                    if (file) {
                      try {
                        const uploadedImageName = await doUploadImage(file);
                        // Save in RHF form
                        setValue("OtherPersonLicenseImage", uploadedImageName, {
                          shouldValidate: true,
                        });
                      } catch (err) {
                        console.error("Upload failed", err);
                      }
                    } else {
                      setValue("OtherPersonLicenseImage", "", {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              )}
            />

            {isPending && (
              <p className="mt-2 text-blue-500 text-sm">
                {t("reservation.forOtherStepTwo.uploadingImage")}
              </p>
            )}
            {uploadError && (
              <p className="mt-2 text-StatusRedBG! text-sm">
                {(uploadError as Error).message ||
                  t("reservation.forOtherStepTwo.uploadImageError")}
              </p>
            )}
            {errors.OtherPersonLicenseImage?.message && (
              <p className="text-StatusRedBG! text-sm">
                {String(errors.OtherPersonLicenseImage?.message)}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="licenceExpiryDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  required
                  placeholder={t(
                    "reservation.stepTwo.licenseExpiryPlaceholder",
                  )}
                  label={t("reservation.stepTwo.licenseExpiryLabel")}
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
