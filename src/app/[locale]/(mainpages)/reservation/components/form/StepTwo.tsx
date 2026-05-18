"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
  useWatch,
} from "react-hook-form";
import { Globe, IdCard, Mail, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/uploadImages/uploadImage.service";
import { useLocale, useTranslations } from "next-intl";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from "@/app/(components)";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { Separator } from "@/app/(components)/ui/separator";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import InputRequired from "@/app/(components)/InputRequired";

interface StepTwoProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
  trigger: UseFormTrigger<ReservationFormValues>;
}

const StepTwo = ({ control, errors, setValue }: StepTwoProps) => {
  const { formData, setFormField } = useBookedCarDetailsStore();
  const t = useTranslations("carDetails");
  const locale = useLocale();

  const residenceTypeStr = useWatch({ control, name: "idNumber" });
  const identityExpiryLabel =
    residenceTypeStr === "2"
      ? t("reservation.stepTwo.identityExpiryDateLabels.passport")
      : residenceTypeStr === "3"
        ? t("reservation.stepTwo.identityExpiryDateLabels.borderNumber")
        : t("reservation.stepTwo.identityExpiryDateLabels.personalId");

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
            name="idNumber"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5 w-full">
                <Label className="flex items-center gap-1.5 text-sm font-medium text-foreground ">
                  {t("reservation.stepTwo.residenceTypeLabel")}
                  <InputRequired />
                </Label>
                <div className="mt-2">
                  <Select
                    dir={locale === "ar" ? "ltr" : "rtl"}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-10 px-3 py-2 bg-[#eceef2] border-input rounded-[8px] text-sm">
                      <SelectValue
                        placeholder={t(
                          "reservation.stepTwo.residenceTypePlaceholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                        {t("reservation.stepTwo.residenceTypes.citizen")}
                      </SelectItem>
                      <SelectItem value="1">
                        {t("reservation.stepTwo.residenceTypes.resident")}
                      </SelectItem>
                      <SelectItem value="2">
                        {t("reservation.stepTwo.residenceTypes.visitor")}
                      </SelectItem>
                      <SelectItem value="3">
                        {t("reservation.stepTwo.residenceTypes.gccCitizen")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.idNumber?.message && (
                  <p className="text-xs text-red-500 mt-1">
                    {String(errors.idNumber.message)}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div className="col-span-1">
          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <Input
                required
                {...field}
                label={t("reservation.stepTwo.nationalityLabel")}
                startIcon={<Globe className="size-4" />}
                placeholder={t("reservation.stepTwo.nationalityPlaceholder")}
                errorMessage={errors.nationality?.message}
              />
            )}
          />
        </div>
        {residenceTypeStr !== "2" && residenceTypeStr !== "3" && (
          <div className="col-span-1">
            <Controller
              name="personalId"
              control={control}
              render={({ field }) => (
                <Input
                  required
                  type="number"
                  {...field}
                  label={t("reservation.stepTwo.personalIdLabel")}
                  startIcon={<IdCard className="size-4" />}
                  placeholder={t("reservation.stepTwo.personalIdPlaceholder")}
                  errorMessage={errors.personalId?.message}
                />
              )}
            />
          </div>
        )}

        {residenceTypeStr === "2" && (
          <div className="col-span-1">
            <Controller
              name="passportNumber"
              control={control}
              render={({ field }) => (
                <Input
                  required
                  type="number"
                  {...field}
                  label={t("reservation.stepTwo.passportNumberLabel")}
                  startIcon={<IdCard className="size-4" />}
                  placeholder={t(
                    "reservation.stepTwo.passportNumberPlaceholder",
                  )}
                  errorMessage={errors.passportNumber?.message}
                />
              )}
            />
          </div>
        )}

        {residenceTypeStr === "3" && (
          <div className="">
            <Controller
              name="borderNumber"
              control={control}
              render={({ field }) => (
                <Input
                  required
                  type="number"
                  {...field}
                  label={t("reservation.stepTwo.borderNumberLabel")}
                  startIcon={<IdCard className="size-4" />}
                  placeholder={t("reservation.stepTwo.borderNumberPlaceholder")}
                  errorMessage={errors.borderNumber?.message}
                />
              )}
            />
          </div>
        )}

        <div>
          <Controller
            name="identityExpiryDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                required
                {...field}
                placeholder={identityExpiryLabel}
                label={identityExpiryLabel}
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
              name="licenseImage"
              control={control}
              render={({ field }) => (
                <InputFileUpload
                  InputAsterisk
                  {...field}
                  label={t("reservation.stepTwo.licenseImageLabel")}
                  placeholder={t("reservation.stepTwo.licenseImagePlaceholder")}
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
              <p className="mt-2 text-blue-500 text-sm">
                {t("reservation.stepTwo.uploadingImage")}
              </p>
            )}
            {uploadError && (
              <p className="mt-2 text-red-500 text-sm">
                {(uploadError as Error).message ||
                  t("reservation.stepTwo.uploadImageError")}
              </p>
            )}
            {errors.licenseImage?.message && (
              <p className="text-red-500 text-sm">
                {String(errors.licenseImage?.message)}
              </p>
            )}
          </div>
          <div className="hidden md:block" />
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
