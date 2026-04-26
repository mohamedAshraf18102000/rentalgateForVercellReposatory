import { format } from "date-fns";
import { Button, DialogWrapper } from "@/app/(components)";
import { DatePicker } from "@/app/(components)/ui/datePicker";
import { InputFileUpload } from "@/app/(components)/ui/inputFileUpload";
import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";
import { useState, useEffect } from "react";
import { useUploadImageMutation } from "@/services/uploadImages/uploadImage.service";
import { toast } from "sonner";
import useUpdateUserProfile from "@/hooks/api/useUpdateUserProfile";
import { useTranslations } from "next-intl";

interface UpdatePasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UpdateLicenceDialog = ({ open, setOpen }: UpdatePasswordDialogProps) => {
  const t = useTranslations("profile.updateLicenceDialog");
  const { userData } = useAuth();
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseDate, setLicenseDate] = useState<Date | undefined>(
    userData?.licenseExpirationDate
      ? new Date(userData.licenseExpirationDate)
      : undefined,
  );

  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadImageMutation();
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateUserProfile();

  useEffect(() => {
    if (userData?.licenseExpirationDate) {
      setLicenseDate(new Date(userData.licenseExpirationDate));
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      let licenseImageName = userData?.licenseImage;

      if (licenseFile) {
        licenseImageName = await uploadImage(licenseFile);
      }

      await updateProfile({
        email: userData?.email,
        mobile: userData?.mobile,
        fullName: userData?.clientName,
        licenseExpirationDate: licenseDate
          ? format(licenseDate, "yyyy-MM-dd")
          : undefined,
        licenseImage: licenseImageName,
      });

      toast.success(t("toastSuccess"));
      setOpen(false);
    } catch (error) {
      toast.error(t("toastError"));
      console.error(error);
    }
  };

  return (
    <DialogWrapper
      className="overflow-hidden!"
      open={open}
      onOpenChange={setOpen}
      size="md"
      contentClassName=""
      closeOnOutsideClick={false}
      scrollableContent={true}
      maxScrollHeight="350px"
      header={{
        mainTitle: (
          <div className="flex items-center justify-between w-full">
            <span className="text-black  flex-1 text-center font-bold text-xl">
              {t("title")}
            </span>
          </div>
        ),
      }}
      content={
        <div className="flex flex-col gap-5 mb-5 px-1">
          <InputFileUpload
            className="text-base!"
            label={t("licenseImageLabel")}
            labelClassName="text-base font-semibold"
            onFileChange={(file) => setLicenseFile(file)}
            initialPreviewUrl={
              userData?.licenseImage
                ? `https://viganium.co/uploads/${userData.licenseImage}`
                : null
            }
          />
          <DatePicker
            label={t("licenseExpiryDateLabel")}
            value={licenseDate}
            onChange={(date) => setLicenseDate(date)}
            fromYear={new Date().getFullYear()}
            toYear={new Date().getFullYear() + 20}
          />
        </div>
      }
      footer={
        <div className="flex w-full justify-end gap-3 pt-2">
          <Button
            size="lg"
            variant="outline"
            className="w-fit text-black hover:bg-gray-100 py-3 border-gray-200 px-8 text-base transition-all"
            onClick={() => setOpen(false)}
          >
            {t("closeButton")}
          </Button>
          <Button
            size="lg"
            className="w-fit text-white py-3 px-12 text-base font-semibold transition-all disabled:opacity-70"
            onClick={handleSave}
            disabled={isUploading || isUpdating}
          >
            {isUploading || isUpdating ? t("savingButton") : t("saveButton")}
          </Button>
        </div>
      }
    />
  );
};

export default UpdateLicenceDialog;
