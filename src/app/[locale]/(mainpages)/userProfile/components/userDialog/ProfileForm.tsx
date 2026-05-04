"use client";

import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { Separator } from "@/app/(components)/ui/separator";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(components)";
import { formatDateAsLocalDay } from "@/lib/utils/formatLocalDateTime";
import { UpdateUserReservationProfileFormValues } from "@/lib/validations/updateUserReservationProfileSchema";
import { Globe, IdCard } from "lucide-react";
import {
  Controller,
  Control,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ProfileFormProps {
  control: Control<UpdateUserReservationProfileFormValues>;
  errors: FieldErrors<UpdateUserReservationProfileFormValues>;
  residenceType?: string;
  licenseImagePreviewUrl: string | null;
  isUploading: boolean;
  uploadLicenseImage: (file: File) => Promise<string>;
  setValue: UseFormSetValue<UpdateUserReservationProfileFormValues>;
  getErrorMessage: (message?: string) => string | undefined;
}

const ProfileForm = ({
  control,
  errors,
  residenceType,
  licenseImagePreviewUrl,
  isUploading,
  uploadLicenseImage,
  setValue,
  getErrorMessage,
}: ProfileFormProps) => {
  const t = useTranslations("profile.updateReservationProfileDialog");

  return (
    <form className="space-y-4" id="update-reservation-profile-form">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="col-span-1">
          <Controller
            name="idNumber"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5 w-full">
                <Label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  {t("fields.residenceType.label")}
                </Label>
                <div className="mt-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10 px-3 py-2 bg-[#eceef2] border-input rounded-[8px] text-sm">
                      <SelectValue
                        placeholder={t("fields.residenceType.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                        {t("fields.residenceType.options.citizen")}
                      </SelectItem>
                      <SelectItem value="1">
                        {t("fields.residenceType.options.resident")}
                      </SelectItem>
                      <SelectItem value="2">
                        {t("fields.residenceType.options.visitor")}
                      </SelectItem>
                      <SelectItem value="3">
                        {t("fields.residenceType.options.gccCitizen")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.idNumber?.message && (
                  <p className="text-xs text-red-500 mt-1">
                    {getErrorMessage(String(errors.idNumber.message))}
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
                {...field}
                label={t("fields.nationality.label")}
                startIcon={<Globe className="size-4" />}
                placeholder={t("fields.nationality.placeholder")}
                errorMessage={getErrorMessage(errors.nationality?.message)}
              />
            )}
          />
        </div>

        {(residenceType === "0" || residenceType === "1") && (
          <div className="col-span-1">
            <Controller
              name="personalId"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  label={t("fields.personalId.label")}
                  startIcon={<IdCard className="size-4" />}
                  placeholder={t("fields.personalId.placeholder")}
                  errorMessage={getErrorMessage(errors.personalId?.message)}
                />
              )}
            />
          </div>
        )}

        {residenceType === "2" && (
          <div className="col-span-1">
            <Controller
              name="passportNumber"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  label={t("fields.passportNumber.label")}
                  startIcon={<IdCard className="size-4" />}
                  placeholder={t("fields.passportNumber.placeholder")}
                  errorMessage={getErrorMessage(errors.passportNumber?.message)}
                />
              )}
            />
          </div>
        )}

        {residenceType === "3" && (
          <div className="col-span-1">
            <Controller
              name="borderNumber"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  label={t("fields.borderNumber.label")}
                  startIcon={<IdCard className="size-4" />}
                  placeholder={t("fields.borderNumber.placeholder")}
                  errorMessage={getErrorMessage(errors.borderNumber?.message)}
                />
              )}
            />
          </div>
        )}

        <div className="col-span-1">
          <Controller
            name="identityExpiryDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                placeholder={t("fields.identityExpiryDate.placeholder")}
                label={t("fields.identityExpiryDate.label")}
              />
            )}
          />
          {errors.identityExpiryDate?.message && (
            <p className="text-red-500 text-sm">
              {getErrorMessage(String(errors.identityExpiryDate?.message))}
            </p>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Controller
            name="licenseImage"
            control={control}
            render={({ field }) => (
              <InputFileUpload
                {...field}
                label={t("fields.licenseImage.label")}
                placeholder={t("fields.licenseImage.placeholder")}
                initialPreviewUrl={licenseImagePreviewUrl}
                onFileChange={async (file) => {
                  if (!file) {
                    setValue("licenseImage", "", { shouldValidate: true });
                    return;
                  }

                  try {
                    const uploadedImageName = await uploadLicenseImage(file);
                    setValue("licenseImage", uploadedImageName, {
                      shouldValidate: true,
                    });
                  } catch (error) {
                    const message =
                      error instanceof Error
                        ? error.message
                        : t("toast.uploadError");
                    toast.error(message);
                  }
                }}
              />
            )}
          />
          {isUploading && (
            <p className="mt-2 text-blue-500 text-sm">
              {t("states.uploadingImage")}
            </p>
          )}
          {errors.licenseImage?.message && (
            <p className="text-red-500 text-sm">
              {getErrorMessage(String(errors.licenseImage?.message))}
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
                value={
                  field.value
                    ? field.value instanceof Date
                      ? field.value
                      : new Date(field.value)
                    : undefined
                }
                onChange={(date) =>
                  field.onChange(formatDateAsLocalDay(date ?? undefined))
                }
                placeholder={t("fields.licenseExpiryDate.placeholder")}
                label={t("fields.licenseExpiryDate.label")}
              />
            )}
          />
          {errors.licenceExpiryDate?.message && (
            <p className="text-red-500 text-sm">
              {getErrorMessage(String(errors.licenceExpiryDate?.message))}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
