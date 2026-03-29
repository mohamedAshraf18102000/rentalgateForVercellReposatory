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

interface StepTwoProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
  trigger: UseFormTrigger<ReservationFormValues>;
}

const StepTwo = ({ control, errors, setValue }: StepTwoProps) => {
  const { formData, setFormField } = useBookedCarDetailsStore();

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
            name="idNumber"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5 w-full">
                <Label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  نوع الإقامة:
                </Label>
                <div className="mt-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-10 px-3 py-2 bg-[#eceef2] border-input rounded-[8px] text-sm text-gray-500">
                      <SelectValue placeholder="أدخل نوع الإقامة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">مواطن</SelectItem>
                      <SelectItem value="1">مقيم</SelectItem>
                      <SelectItem value="2">زائر</SelectItem>
                      <SelectItem value="3">مواطن خليجي</SelectItem>
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
                {...field}
                label="الجنسية:"
                startIcon={<Globe className="size-4" />}
                placeholder="أدخل الجنسية"
                errorMessage={errors.nationality?.message}
              />
            )}
          />
        </div>
        {residenceTypeStr !== "2" && (
          <div className="col-span-1">
            <Controller
              name="personalId"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  label="بطاقة تحقيق الشخصيه"
                  startIcon={<IdCard className="size-4" />}
                  placeholder="أدخل بطاقة تحقيق الشخصيه"
                  errorMessage={errors.personalId?.message}
                />
              )}
            />
          </div>
        )}

        {(residenceTypeStr === "2" || residenceTypeStr === "3") && (
          <div className="col-span-1">
            <Controller
              name="passportNumber"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  label="رقم الباسبور"
                  startIcon={<IdCard className="size-4" />}
                  placeholder="أدخل رقم الباسبور"
                  errorMessage={errors.passportNumber?.message}
                />
              )}
            />
          </div>
        )}

        {residenceTypeStr === "3" && (
          <div className="col-span-1">
            <Controller
              name="borderNumber"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  label="رقم الحدود"
                  startIcon={<IdCard className="size-4" />}
                  placeholder="أدخل رقم الحدود"
                  errorMessage={errors.borderNumber?.message}
                />
              )}
            />
          </div>
        )}
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
