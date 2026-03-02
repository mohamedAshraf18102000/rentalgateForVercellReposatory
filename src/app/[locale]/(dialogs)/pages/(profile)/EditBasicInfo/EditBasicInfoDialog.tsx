"use client";

import * as React from "react";
import { Button, Input, Label, DialogWrapper } from "@/ui";
import type { EditBasicInfoProps } from "./EditBasicInfo.types";
import { useTranslations } from "next-intl";
import { useClientStore } from "@/lib/api/stores";
import { getUserDisplayName } from "@/app/(components)/navbar/utils";
import Image from "next/image";
import { ArrowIcon } from "@/constants/icons";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { uploadImage } from "@/lib/api/services/client.service";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";

export function EditBasicInfoDialog({
    onSave,
    onClose,
}: EditBasicInfoProps) {
    const { clientData } = useClientStore();
    const t = useTranslations("profile");
    const [isLoading, setIsLoading] = React.useState(false);
    const [firstName, setFirstName] = React.useState(clientData?.firstName || "");
    const [lastName, setLastName] = React.useState(clientData?.lastName || "");
    const [mobile, setMobile] = React.useState(clientData?.mobile || "");
    const [isPhoneValid, setIsPhoneValid] = React.useState(true); // Default to true (optional field)
    const hasOriginalPhone = React.useMemo(() => {
        return !!(clientData?.mobile && clientData.mobile.trim() !== "");
    }, [clientData?.mobile]);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(
        clientData?.image || null
    );

    const displayName = clientData ? getUserDisplayName(clientData) : "";

    // Get full image URL if it exists
    const getImageUrl = (imagePath: string | null | undefined): string | null => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        // Assuming images are stored on a CDN or server
        return `https://viganium.co/uploads/${imagePath}`;
    };

    React.useEffect(() => {
        if (clientData?.image && !imagePreview) {
            setImagePreview(getImageUrl(clientData.image));
        }
    }, [clientData?.image]);

    // Validate phone when mobile changes (only if phone exists)
    React.useEffect(() => {
        if (mobile && mobile.trim() !== "") {
            try {
                const isValid = isValidPhoneNumber(mobile);
                setIsPhoneValid(isValid);
            } catch {
                setIsPhoneValid(false);
            }
        } else {
            // If phone is empty, consider it valid (optional field)
            setIsPhoneValid(true);
        }
    }, [mobile]); // Run when mobile changes

    // If user didn't have a phone number before, allow saving without validation
    const canSave = React.useMemo(() => {
        // If no original phone, allow saving (user can add phone or leave it empty)
        if (!hasOriginalPhone) {
            return true;
        }
        // If original phone existed, validate current phone
        // If current phone is empty, it's valid (user removed it)
        if (!mobile || mobile.trim() === "") {
            return true;
        }
        // If current phone exists, it must be valid
        return isPhoneValid;
    }, [hasOriginalPhone, mobile, isPhoneValid]);

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

    // Extract filename only from image path
    const getImageFilename = (imagePath: string | null | undefined): string | undefined => {
        if (!imagePath) return undefined;
        // If it's already just a filename, return it
        if (!imagePath.includes('/') && !imagePath.includes('\\')) {
            return imagePath;
        }
        // Extract filename from URL or path
        const parts = imagePath.split('/');
        const filename = parts[parts.length - 1];
        // Remove any query parameters
        return filename.split('?')[0];
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            let imageFilename: string | undefined = undefined;

            if (imageFile) {
                // Upload new image file
                try {
                    imageFilename = await uploadImage(imageFile);
                } catch (error) {
                    console.error("Image upload error:", error);
                    toast.error(error instanceof Error ? error.message : "فشل في رفع الصورة");
                    setIsLoading(false);
                    return;
                }
            } else if (clientData?.image) {
                // Extract filename from existing image path
                imageFilename = getImageFilename(clientData.image);
            }

            await onSave({
                firstName,
                lastName,
                mobile,
                image: imageFilename,
            });
            onClose();
        } catch (error) {
            console.error("Error saving:", error);
            toast.error(error instanceof Error ? error.message : "فشل في حفظ البيانات");
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
                mainTitle: t("basicInformation"),
            }}
            content={
                <div className="grid gap-6 ">
                    {/* Edit Profile Picture Section */}
                    <div className="flex items-center justify-between gap-4  bg-[#eceef2c4] p-[12px] rounded-[18px]">

                        <div className="relative">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300">
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt={displayName}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-gray-600 text-lg font-bold">
                                            {displayName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex items-center justify-between  gap-4 flex-1  ">
                            <div className="flex gap-1.5 flex-col" >
                                <h4 className="font-semibold text-gray-900 text-[15px] ">
                                    {t("editProfilePicture")}
                                </h4>
                                <p className="text-[#595959] text-[13px]">
                                    {t("updatePersonalPhoto")}
                                </p>
                            </div>
                            <ArrowIcon className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="grid gap-2">
                        <Input
                            label={t("fullName")}
                            id="full-name"
                            value={`${firstName} ${lastName}`}
                            onChange={(e) => {
                                const parts = e.target.value.split(" ");
                                setFirstName(parts[0] || "");
                                setLastName(parts.slice(1).join(" ") || "");
                            }}
                            placeholder={t("fullNamePlaceholder")}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="grid gap-2">
                        <CountryPhone
                            label={t("mobileNumber")}
                            value={mobile}
                            onChange={setMobile}
                            disabled={isLoading}
                            showValidation={true}
                            placeholder={t("mobilePlaceholder")}
                        />
                    </div>
                </div>
            }
            footer={
                <div className="grid grid-cols-12   gap-4 w-full mt-8">
                    <div className="col-span-4">
                        <Button variant="outline" className="w-full" size="lg" onClick={onClose} disabled={isLoading}>
                            {t("cancel")}
                        </Button>
                    </div>
                    <div className="col-span-8">
                        <Button 
                            className="w-full" 
                            size="lg" 
                            onClick={handleSave} 
                            disabled={isLoading || !canSave}
                        >
                            {isLoading ? t("saving") : t("saveChanges")}
                        </Button>
                    </div>
                </div>
            }
        />
    );
}

