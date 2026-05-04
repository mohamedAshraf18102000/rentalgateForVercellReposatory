import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/uploadImages/uploadImage.service";
import { Button, DialogWrapper } from "@/app/(components)";
import { useClientStore } from "@/lib/api/stores/client.store";
import { updateUserProfile } from "@/services/userProfile/updateUserProfile.service";
import { UpdateUserProfilePayload } from "@/types/userProfile/updateUserProfile";
import { formatDateAsLocalDay } from "@/lib/utils/formatLocalDateTime";
import {
  updateUserReservationProfileSchema,
  UpdateUserReservationProfileFormValues,
} from "@/lib/validations/updateUserReservationProfileSchema";
import { useTranslations } from "next-intl";
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
  const { clientData, fetchClientData } = useClientStore();
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
    defaultValues: {
      idNumber: "0",
      nationality: "",
      personalId: "",
      passportNumber: "",
      borderNumber: "",
      identityExpiryDate: undefined,
      licenseImage: "",
      licenceExpiryDate: undefined,
    },
  });

  const residenceType = useWatch({ control, name: "idNumber" });
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

  const { mutate: patchReservationProfile, isPending } = useMutation({
    mutationFn: async (values: UpdateUserReservationProfileFormValues) => {
      const payload: UpdateUserProfilePayload = {
        fullName: clientData?.clientName || undefined,
        email: clientData?.email || undefined,
        mobile: clientData?.mobile || undefined,
        nationality: values.nationality,
        residenceType: Number(values.idNumber),
        identityExpiryDate:
          formatDateAsLocalDay(values.identityExpiryDate) || undefined,
        licenseExpirationDate:
          formatDateAsLocalDay(values.licenceExpiryDate) || undefined,
        licenseImage: values.licenseImage,
      };

      if (values.idNumber === "2")
        payload.passportNumber = values.passportNumber;
      else if (values.idNumber === "3")
        payload.borderNumber = values.borderNumber;
      else payload.personalId = values.personalId;

      return updateUserProfile(payload);
    },
    onSuccess: () => {
      toast.success(t("toast.updateSuccess"));
      fetchClientData();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("toast.updateError"));
    },
  });

  const handleAutoFillFromProfile = () => {
    if (!clientData) {
      toast.error(t("toast.noProfileData"));
      return;
    }

    const residenceValue =
      typeof clientData.residenceType === "object"
        ? String(
            clientData.residenceType?.residenceTypeId ??
              clientData.residenceType?.id ??
              0,
          )
        : String(clientData.residenceType ?? 0);

    const nationalityValue =
      typeof clientData.nationality === "object"
        ? clientData.nationality?.name ||
          clientData.nationality?.englishName ||
          clientData.nationality?.arabicName ||
          ""
        : String(clientData.nationality ?? "");

    setValue("idNumber", residenceValue || "0");
    setValue("nationality", nationalityValue);
    setValue("personalId", String(clientData.personalId ?? ""));
    setValue("passportNumber", String(clientData.passportNumber ?? ""));
    setValue("borderNumber", String(clientData.borderNumber ?? ""));
    setValue(
      "identityExpiryDate",
      clientData.licenseExpirationDate
        ? new Date(clientData.licenseExpirationDate)
        : undefined,
    );
    setValue(
      "licenceExpiryDate",
      clientData.licenseExpirationDate
        ? new Date(clientData.licenseExpirationDate)
        : undefined,
    );
    setValue("licenseImage", String(clientData.licenseImage ?? ""));
  };

  const onSubmit = (values: UpdateUserReservationProfileFormValues) => {
    patchReservationProfile(values);
  };

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    handleAutoFillFromProfile();
    // We only want to auto-fill once when dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      size="lg"
      closeOnOutsideClick={false}
      scrollableContent={true}
      maxScrollHeight="500px"
      header={{
        mainTitle: (
          <div>
            <p>{t("title")}</p>
          </div>
        ),
      }}
      content={
        <ProfileForm
          control={control}
          errors={errors}
          residenceType={residenceType}
          licenseImagePreviewUrl={licenseImagePreviewUrl}
          isUploading={isUploading}
          uploadLicenseImage={uploadLicenseImage}
          setValue={setValue}
          getErrorMessage={getErrorMessage}
        />
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
                disabled={isUploading}
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
