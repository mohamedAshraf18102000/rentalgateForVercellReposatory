"use client";

import { useAuth } from "@/app/(components)/navbar/hooks/useAuth";
import useUpdateUserProfile from "@/hooks/api/useUpdateUserProfile";
import { useClientStore } from "@/lib/api/stores/client.store";
import { useUploadImageMutation } from "@/services/uploadImages/uploadImage.service";
import { ImagePlus, Loader2, Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ProfileImageCropDialog from "./ProfileImageCropDialog";
import { toast } from "sonner";

const FALLBACK_AVATAR = "/profile/userFallbackImage.webp";

function ProfileAvatarPicture({ avatarSrc }: { avatarSrc: string }) {
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <Image
      className={"object-fill scale-120"}
      src={loadFailed ? FALLBACK_AVATAR : avatarSrc}
      alt=""
      fill
      onError={() => setLoadFailed(true)}
    />
  );
}

interface UserImageProps {
  avatarSrc: string;
  /** Changes after save so Next/Image remounts and bypasses cached optimized response. */
  avatarKey: string;
  onProfileImageSaved?: () => void;
  className?: string;
}

const UserImage = ({
  avatarSrc,
  avatarKey,
  className,
  onProfileImageSaved,
}: UserImageProps) => {
  const t = useTranslations("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState("");
  const { userData } = useAuth();
  const fetchClientData = useClientStore((s) => s.fetchClientData);
  const setClientData = useClientStore((s) => s.setClientData);

  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadImageMutation();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  const isBusy = isUploadingImage || isUpdatingProfile;

  const handleActivatePicker = () => {
    if (isBusy) return;
    fileInputRef.current?.click();
  };

  const releaseCropPreview = () => {
    setCropImageSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPendingFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userData) return;

    setCropImageSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setPendingFileName(file.name);
    setCropOpen(true);
  };

  const handleCropDialogChange = (open: boolean) => {
    if (!open) releaseCropPreview();
    setCropOpen(open);
  };

  const handleCroppedUpload = async (file: File) => {
    if (!userData) return;

    try {
      const filename = await uploadImage(file);
      await updateProfile({
        email: userData.email,
        mobile: userData.mobile,
        fullName: userData.clientName,
        profileImage: filename,
      });
      const current = useClientStore.getState().clientData;
      if (current) {
        setClientData({ ...current, profileImage: filename });
      }
      await fetchClientData();
      onProfileImageSaved?.();
      toast.success(t("updateSuccess"));
      handleCropDialogChange(false);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : t("updateError"));
    }
  };

  return (
    <>
      <ProfileImageCropDialog
        key={cropImageSrc ?? "profile-crop-closed"}
        open={cropOpen}
        imageSrc={cropImageSrc}
        sourceFileName={pendingFileName}
        onOpenChange={handleCropDialogChange}
        onConfirm={handleCroppedUpload}
        isApplying={isBusy}
      />

      <div
        role="button"
        tabIndex={0}
        aria-busy={isBusy}
        aria-label={t("editProfilePicture")}
        onClick={handleActivatePicker}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            handleActivatePicker();
          }
        }}
        className={`group relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-[#BE2326] sm:h-[100px] sm:w-[100px] ${
          isBusy ? "cursor-wait" : "cursor-pointer"
        } ${className}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isBusy}
          onChange={handleFileChange}
        />

        <ProfileAvatarPicture key={avatarKey} avatarSrc={avatarSrc} />

        <div className="md:hidden absolute inset-0 z-10 flex cursor-pointer items-center justify-center transition-opacity duration-1000 ease-in-out motion-safe:animate-pulse">
          <Pencil className="h-5 w-5 text-white/80 " />
        </div>

        <div
          className={`pointer-events-none absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50 transition-opacity duration-300 ease-in-out ${
            isBusy
              ? "opacity-100"
              : "opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
          }`}
        >
          {!isBusy ? <ImagePlus className="h-6 w-6 text-white" /> : null}
        </div>

        {isBusy ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/40">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default UserImage;
