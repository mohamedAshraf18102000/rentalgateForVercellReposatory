"use client";

import * as React from "react";
import { Button, Label, DialogWrapper } from "@/ui";
import type { EditLicenseImageProps } from "./EditLicenseImage.types";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { uploadImage } from "@/lib/api/services/client.service";
import { toast } from "sonner";
import Image from "next/image";
import { normalizeImageUrl } from "@/util/image";

export function EditLicenseImageDialog({
    currentImageUrl,
    onSave,
    onClose,
}: EditLicenseImageProps) {
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(
        currentImageUrl ? normalizeImageUrl(currentImageUrl) : null
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const t = useTranslations("common");
    const params = useParams();
    const locale = params?.locale as string || "ar";

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!imageFile) {
            toast.error(locale === "ar" ? "يرجى اختيار صورة جديدة" : "Please select a new image");
            return;
        }

        setIsLoading(true);
        try {
            // Upload new image file
            const imageFilename = await uploadImage(imageFile);
            
            // Call onSave with the filename
            await onSave(imageFilename);
            onClose();
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error(error instanceof Error ? error.message : (locale === "ar" ? "فشل في رفع الصورة" : "Failed to upload image"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DialogWrapper
            open={true}
            onOpenChange={(open) => !open && onClose()}
            size="md"
            closeOnOutsideClick={true}
            header={{
                mainTitle: locale === "ar" ? "تعديل صورة الرخصة" : "Edit License Image",
            }}
            content={
                <div className="grid gap-4">
                    <div className="space-y-2">
                        {/* <Label className="text-sm font-medium">
                            {locale === "ar" ? "صورة الرخصة" : "License Image"}
                        </Label> */}
                        <div className="mt-3 w-full">
                            <div className="border border-dashed border-gray-300 rounded-lg px-4 py-[30px] text-center hover:border-primary transition-colors bg-[#ECEEF2]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="license-image-upload"
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="license-image-upload"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-[150px] mx-auto mb-3">
                                            <Image
                                                src={imagePreview}
                                                alt="License preview"
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-[56px] h-[56px] bg-white border border-[#D6D6D6] shadow-[0px_4px_13.6px_0px_#0D3FAA0D] rounded-[14px] flex items-center justify-center mb-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 3.5H10C6.22876 3.5 4.34315 3.5 3.17157 4.67157C2 5.84315 2 7.72876 2 11.5V12.5C2 16.2712 2 18.1569 3.17157 19.3284C4.34315 20.5 6.22876 20.5 10 20.5H14C17.7712 20.5 19.6569 20.5 20.8284 19.3284C22 18.1569 22 16.2712 22 12.5V11.5C22 7.72876 22 5.84315 20.8284 4.67157C19.6569 3.5 17.7712 3.5 14 3.5Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
                                                <path d="M5 16C6.03569 13.4189 9.89616 13.2491 11 16" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M9.75 9.75C9.75 10.7165 8.9665 11.5 8 11.5C7.0335 11.5 6.25 10.7165 6.25 9.75C6.25 8.7835 7.0335 8 8 8C8.9665 8 9.75 8.7835 9.75 9.75Z" stroke="#1A1A1A" strokeWidth="1.5" />
                                                <path d="M14 8.5H19M14 12H19M14 15.5H16.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className="text-sm text-[#595959]">
                                        {locale === "ar" ? "اضغط لرفع صورة الرخصة" : "Click to upload license image"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            }
            footer={
                <div className="grid grid-cols-12 gap-4 w-full mt-8">
                    <div className="col-span-4">
                        <Button variant="outline" className="w-full" size="lg" onClick={onClose} disabled={isLoading}>
                            {t("cancel") || "إلغاء"}
                        </Button>
                    </div>
                    <div className="col-span-8">
                        <Button className="w-full" size="lg" onClick={handleSave} disabled={isLoading || !imageFile}>
                            {isLoading ? (t("saving") || "جاري الحفظ...") : (t("saveChanges") || "حفظ التغييرات")}
                        </Button>
                    </div>
                </div>
            }
        />
    );
}
