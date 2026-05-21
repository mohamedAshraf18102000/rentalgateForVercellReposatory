import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/uploadImages/uploadImage.service";
import { Button, DialogWrapper } from "@/app/(components)";
import { UpdateUserProfilePayload } from "@/types/userProfile/updateUserProfile";
import { formatDateAsLocalDay } from "@/lib/utils/formatLocalDateTime";
import {
  getLockedReservationProfileFields,
  mapUserProfileToReservationFormValues,
} from "@/lib/utils/mapUserProfileToReservationForm";
import {
  mergeUpdateUserReservationProfileFormValues,
  updateUserReservationProfileDefaultValues,
  updateUserReservationProfileSchema,
  UpdateUserReservationProfileFormValues,
} from "@/lib/validations/updateUserReservationProfileSchema";
import useGetUserProfile from "@/hooks/api/useGetUserProfile";
import useUpdateUserProfile from "@/hooks/api/useUpdateUserProfile";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import ProfileForm from "./ProfileForm";

interface UpdateUserSavedLocationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UpdateUserReservationProfile = ({
  open,
  setOpen,
}: UpdateUserSavedLocationDialogProps) => {
  const t = useTranslations("profile.updateReservationProfileDialog");
  const locale = useLocale();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetUserProfile(open);

  const imagesPrefixUrl = process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL?.replace(
    /\/+$/,
    "",
  );

  const getErrorMessage = (message?: string) => {
    if (!message) return undefined;
    if (message.startsWith("validation.")) return t(message as any);
    return message;
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateUserReservationProfileFormValues>({
    resolver: zodResolver(updateUserReservationProfileSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: updateUserReservationProfileDefaultValues,
  });

  const residenceType = useWatch({ control, name: "idNumber" });
  const lockedFields = getLockedReservationProfileFields(profileData);
  const licenseImageValue = useWatch({ control, name: "licenseImage" });
  const licenseImagePreviewUrl = licenseImageValue
    ? licenseImageValue.startsWith("http")
      ? licenseImageValue
      : imagesPrefixUrl
        ? `${imagesPrefixUrl}/${licenseImageValue}`
        : null
    : null;

  const { mutateAsync: uploadLicenseImage, isPending: isUploading } =
    useMutation({
      mutationFn: uploadImage,
    });

  const { mutate: patchReservationProfile, isPending } = useUpdateUserProfile();

  const buildUpdatePayload = (
    values: UpdateUserReservationProfileFormValues,
  ): UpdateUserProfilePayload => {
    const payload: UpdateUserProfilePayload = {
      fullName: values.fullName,
      email: values.email,
      mobile: values.mobile,
      nationality: values.nationality,
      residenceType: Number(values.idNumber),
      identityExpiryDate:
        formatDateAsLocalDay(values.identityExpiryDate) || undefined,
      licenseExpirationDate:
        formatDateAsLocalDay(values.licenceExpiryDate) || undefined,
      licenseImage: values.licenseImage,
    };

    if (values.idNumber === "2") payload.passportNumber = values.passportNumber;
    else if (values.idNumber === "3")
      payload.borderNumber = values.borderNumber;
    else payload.personalId = values.personalId;

    return payload;
  };

  const applyProfileToForm = () => {
    if (!profileData) {
      toast.error(t("toast.noProfileData"));
      return;
    }

    reset(
      mergeUpdateUserReservationProfileFormValues(
        mapUserProfileToReservationFormValues(profileData),
      ),
    );
  };

  const onSubmit = (values: UpdateUserReservationProfileFormValues) => {
    patchReservationProfile(buildUpdatePayload(values), {
      onSuccess: () => {
        toast.success(t("toast.updateSuccess"));
        reset(updateUserReservationProfileDefaultValues);
        setOpen(false);
      },
      onError: (error: Error) => {
        toast.error(error.message || t("toast.updateError"));
      },
    });
  };

  useEffect(() => {
    if (!open) {
      reset(updateUserReservationProfileDefaultValues);
      return;
    }

    if (profileData) {
      applyProfileToForm();
    } else if (isProfileError) {
      toast.error(t("toast.updateError"));
    }
    // Auto-fill when dialog opens and profile data is available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profileData, isProfileError, reset]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="xl"
      closeOnOutsideClick={false}
      scrollableContent={true}
      maxScrollHeight="550px"
      showScrollbar={true}
      header={{
        mainTitle: (
          <div>
            <p>{t("title")}</p>
          </div>
        ),
      }}
      content={
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="px-3">
          <ProfileForm
            control={control}
            errors={errors}
            residenceType={residenceType}
            licenseImagePreviewUrl={licenseImagePreviewUrl}
            isUploading={isUploading}
            uploadLicenseImage={uploadLicenseImage}
            setValue={setValue}
            getErrorMessage={getErrorMessage}
            isProfileLoading={isProfileLoading}
            lockedFields={lockedFields}
          />
        </div>
      }
      footer={
        <>
          <div className="p-2 flex justify-end gap-2 border-t mt-3 w-full">
            <div className="w-1/4 flex justify-end gap-2 ">
              <Button
                className="text-base"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                className="text-base w-2/3"
                loading={isPending}
                onClick={handleSubmit(onSubmit)}
                disabled={isUploading || isProfileLoading}
              >
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </>
      }
    />
  );
};

export default UpdateUserReservationProfile;
