"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/(components)/ui/dialog";
import { Button } from "@/app/(components)/ui/button";
import { getCroppedProfileImageFile } from "@/util/cropImage";
import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useTranslations } from "next-intl";

interface ProfileImageCropDialogProps {
  open: boolean;
  imageSrc: string | null;
  sourceFileName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => void | Promise<void>;
  isApplying?: boolean;
}

const ProfileImageCropDialog = ({
  open,
  imageSrc,
  sourceFileName,
  onOpenChange,
  onConfirm,
  isApplying,
}: ProfileImageCropDialogProps) => {
  const t = useTranslations("profile");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const file = await getCroppedProfileImageFile(
      imageSrc,
      croppedAreaPixels,
      sourceFileName,
    );
    await onConfirm(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(100vw-2rem,420px)] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-border border-b px-5 py-4 text-start">
          <DialogTitle className="text-base text-start">
            {t("cropProfileTitle")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("cropProfileDescription")}
          </DialogDescription>
        </DialogHeader>

        {imageSrc ? (
          <div className="bg-muted relative mx-auto w-full">
            <div className="relative h-[min(70vh,320px)] w-full sm:h-[360px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                minZoom={1}
                maxZoom={3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          </div>
        ) : null}

        <div className="border-border space-y-2 border-t px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground w-14 shrink-0 text-xs">
              {t("cropZoom")}
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              disabled={!imageSrc || isApplying}
              className="accent-primary h-2 w-full cursor-pointer disabled:opacity-50"
              aria-label={t("cropZoom")}
            />
          </div>
        </div>

        <DialogFooter className="border-border flex-row justify-end gap-2 border-t px-5 py-4 sm:justify-end">
          <Button
            className="text-base! p-5!"
            type="button"
            variant="outline"
            size="sm"
            disabled={isApplying}
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            className="text-base! p-5!"
            type="button"
            size="sm"
            disabled={!imageSrc || !croppedAreaPixels || isApplying}
            onClick={() => void handleApply()}
          >
            {isApplying ? t("saving") : t("applyPhoto")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageCropDialog;
