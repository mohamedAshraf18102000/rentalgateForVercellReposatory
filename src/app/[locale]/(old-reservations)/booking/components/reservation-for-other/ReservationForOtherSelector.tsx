'use client';

/**
 * Reservation For Other Selector Component
 * Allows users to enter details for booking a reservation for another person
 */

import React, { useState, useEffect } from 'react';
import { InfoCard } from '@/app/(components)/template/InfoCard';
import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Input } from '@/app/(components)/ui/input';
import { Button } from '@/app/(components)/ui/button';
import CountryPhone from '@/app/(components)/template/phone/CountryPhone';
import { uploadImage } from '@/lib/api/services/client.service';
import { toast } from 'sonner';
import Image from 'next/image';
import type { ReservationForOtherSelectorProps } from './ReservationForOtherSelector.types';

export const ReservationForOtherSelector: React.FC<ReservationForOtherSelectorProps> = ({
    locale,
    reservationForOther,
    onReservationForOtherChange,
}) => {
    const [name, setName] = useState(reservationForOther?.name || '');
    const [phone, setPhone] = useState(reservationForOther?.phone || '');
    const [nationalId, setNationalId] = useState(reservationForOther?.nationalId || '');
    const [licenseImageFile, setLicenseImageFile] = useState<File | null>(null);
    const [licenseImagePreview, setLicenseImagePreview] = useState<string | null>(
        reservationForOther?.licenseImage ? `https://viganium.co/uploads/${reservationForOther.licenseImage}` : null
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    // Sync state when reservationForOther changes or dialog opens
    useEffect(() => {
        if (isDialogOpen) {
            setName(reservationForOther?.name || '');
            setPhone(reservationForOther?.phone || '');
            setNationalId(reservationForOther?.nationalId || '');
            setLicenseImageFile(null);
            setLicenseImagePreview(
                reservationForOther?.licenseImage ? `https://viganium.co/uploads/${reservationForOther.licenseImage}` : null
            );
        }
    }, [isDialogOpen, reservationForOther]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error(locale === 'ar' ? 'يرجى اختيار ملف صورة' : 'Please select an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error(locale === 'ar' ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' : 'Image size must be less than 5MB');
                return;
            }
            setLicenseImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLicenseImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApply = async () => {
        // Validate required fields
        if (!name.trim()) {
            toast.error(locale === 'ar' ? 'يرجى إدخال الاسم' : 'Please enter the name');
            return;
        }
        if (!phone.trim()) {
            toast.error(locale === 'ar' ? 'يرجى إدخال رقم الجوال' : 'Please enter the phone number');
            return;
        }
        if (!nationalId.trim()) {
            toast.error(locale === 'ar' ? 'يرجى إدخال رقم الهوية' : 'Please enter the ID number');
            return;
        }
        if (!licenseImageFile && !reservationForOther?.licenseImage) {
            toast.error(locale === 'ar' ? 'يرجى رفع صورة الرخصة' : 'Please upload the license image');
            return;
        }

        setIsUploading(true);
        try {
            let licenseImageFilename = reservationForOther?.licenseImage || '';

            // Upload new image if selected
            if (licenseImageFile) {
                try {
                    licenseImageFilename = await uploadImage(licenseImageFile);
                } catch (error) {
                    console.error('Image upload error:', error);
                    toast.error(locale === 'ar' ? 'فشل في رفع صورة الرخصة' : 'Failed to upload license image');
                    setIsUploading(false);
                    return;
                }
            }

            // Save the data
            onReservationForOtherChange({
                name: name.trim(),
                phone: phone.trim(),
                nationalId: nationalId.trim(),
                licenseImage: licenseImageFilename,
            });

            toast.success(locale === 'ar' ? 'تم حفظ البيانات بنجاح' : 'Data saved successfully');
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving reservation for other:', error);
            toast.error(locale === 'ar' ? 'فشل في حفظ البيانات' : 'Failed to save data');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        // Reset to original values
        setName(reservationForOther?.name || '');
        setPhone(reservationForOther?.phone || '');
        setNationalId(reservationForOther?.nationalId || '');
        setLicenseImageFile(null);
        setLicenseImagePreview(
            reservationForOther?.licenseImage ? `https://viganium.co/uploads/${reservationForOther.licenseImage}` : null
        );
        setIsDialogOpen(false);
    };

    const handleRemove = () => {
        onReservationForOtherChange(null);
        setName('');
        setPhone('');
        setNationalId('');
        setLicenseImageFile(null);
        setLicenseImagePreview(null);
        toast.success(locale === 'ar' ? 'تم إلغاء الحجز لشخص آخر' : 'Reservation for other person cancelled');
    };

    return (
        <div className="mt-6">
            <DialogWrapper
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                size="md"
                scrollableContent={true}
                header={{
                    mainTitle: locale === 'ar' ? 'حجز لشخص آخر' : 'Book for another person',
                    description: locale === 'ar' ? 'قم بإدخال البيانات الخاصة بهذا الشخص' : 'Please enter this person\'s details',
                }}
                content={
                    <div className="space-y-4 pb-4">

                        {/* License Image Upload */}
                        <div>
                            <div className="border-1 border-dashed border-gray-300 rounded-lg px-4 py-[30px] text-center hover:border-primary transition-colors bg-[#ECEEF2]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="license-image-upload"
                                />
                                <label
                                    htmlFor="license-image-upload"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                    {licenseImagePreview ? (
                                        <div className="relative w-full  h-[150px] mx-auto mb-3">
                                            <Image
                                                src={licenseImagePreview}
                                                alt="License preview"
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-[56px] h-[56px] bg-white   border  border-[#D6D6D6]  shadow-[0px_4px_13.6px_0px_#0D3FAA0D] rounded-[14px] flex items-center justify-center mb-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 3.5H10C6.22876 3.5 4.34315 3.5 3.17157 4.67157C2 5.84315 2 7.72876 2 11.5V12.5C2 16.2712 2 18.1569 3.17157 19.3284C4.34315 20.5 6.22876 20.5 10 20.5H14C17.7712 20.5 19.6569 20.5 20.8284 19.3284C22 18.1569 22 16.2712 22 12.5V11.5C22 7.72876 22 5.84315 20.8284 4.67157C19.6569 3.5 17.7712 3.5 14 3.5Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linejoin="round" />
                                                <path d="M5 16C6.03569 13.4189 9.89616 13.2491 11 16" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M9.75 9.75C9.75 10.7165 8.9665 11.5 8 11.5C7.0335 11.5 6.25 10.7165 6.25 9.75C6.25 8.7835 7.0335 8 8 8C8.9665 8 9.75 8.7835 9.75 9.75Z" stroke="#1A1A1A" stroke-width="1.5" />
                                                <path d="M14 8.5H19M14 12H19M14 15.5H16.5" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg> 
                                        </div>
                                    )}
                                    <span className="text-sm text-[#595959]">
                                        {locale === 'ar' ? 'اضغط لرفع صورة الرخصة' : 'Click to upload license image'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <Input
                                type="text"
                                label={locale === 'ar' ? 'اسمه بالكامل:' : 'Full name:'}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={locale === 'ar' ? 'أدخل الأسم' : 'Enter the name'}
                                className="bg-white border-gray-300 focus:border-primary"
                                size="md"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <CountryPhone
                                value={phone}
                                onChange={setPhone}
                                placeholder={locale === 'ar' ? 'أدخل رقم الجوال' : 'Enter the mobile number'}
                                defaultCountry="sa"
                                showValidation={true}
                                onValidationChange={setIsPhoneValid}
                                label={locale === 'ar' ? 'رقم الجوال الخاص به:' : 'His/Her mobile number:'}
                            />
                        </div>

                        {/* ID Number */}
                        <div>
                            <Input
                                type="text"
                                label={locale === 'ar' ? 'رقم الهوية الخاصة به:' : 'His/Her ID number:'}
                                value={nationalId}
                                onChange={(e) => setNationalId(e.target.value)}
                                placeholder={locale === 'ar' ? 'أدخل رقم الهوية' : 'Enter the ID number'}
                                className="bg-white border-gray-300 focus:border-primary"
                                size="md"
                            />
                        </div>
                    </div>
                }
                footer={
                    <div className="flex gap-2 w-full mt-4">
                        {reservationForOther && (
                            <Button
                                onClick={handleRemove}
                                variant="outline"
                                className="flex-1"
                                size="lg"
                                disabled={isUploading}
                            >
                                {locale === 'ar' ? 'إلغاء الحجز لشخص آخر' : 'Cancel reservation for another person'}
                            </Button>
                        )}
                        <Button
                            onClick={handleApply}
                            className="flex-1"
                            size="lg"
                            disabled={isUploading}
                        >
                            {isUploading
                                ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                                : (locale === 'ar' ? 'تأكيد' : 'Confirm')
                            }
                        </Button>
                    </div>
                }
                trigger={
                    <div>
                        <InfoCard
                            title={locale === 'ar' ? 'حجز لشخص آخر' : 'Book for another person'}
                            description={
                                locale === 'ar'
                                    ? 'قم بإدخال البيانات الخاصة بهذا الشخص'
                                    : 'Please enter this person\'s details'
                            }
                            image='/shared/person.png' // TODO: Update with appropriate icon for "booking for another person"
                            locale={locale}
                            onClick={() => setIsDialogOpen(true)}
                        />
                    </div>
                }
            />
        </div>
    );
};

