/**
 * Custom hook for First Booking Check logic
 * Handles form state, validation, API calls, and data fetching
 */

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { isAuthenticated, getAuthHeader } from '@/util/auth';
import { URL } from '@/util/api';
import { uploadImage } from '@/lib/api/services/client.service';
import type { FormData, ValidateCompletedDataResponse, CompleteDataRequest, ClientDataResponse } from '../util/types';

export function useFirstBookingCheck(locale: string) {
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobileDisabled, setIsMobileDisabled] = useState(false);
    const [isEmailDisabled, setIsEmailDisabled] = useState(false);
    const hasRequestedRef = useRef(false);
    const t = useTranslations('carDetails');
    const tValidation = useTranslations('validation.AUTH_ERRORS');

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
        trigger,
    } = useForm<FormData>({
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {
            clientType: 'VISITOR',
            gender: 'MALE',
            birthdate: undefined,
            licenseExpiration: undefined,
            copyNum: '',
            nationality: '',
            nationalId: '',
            mobile: '',
            email: '',
            licenseNumber: '',
        },
    });

    const clientType = watch('clientType');

    // Fetch client data when dialog opens
    useEffect(() => {
        const fetchClientData = async () => {
            if (!showDialog || !isAuthenticated()) {
                return;
            }

            try {
                const authHeader = getAuthHeader();
                const response = await fetch(URL('/clients/get-data'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...authHeader,
                    },
                });

                if (response.ok) {
                    const data: ClientDataResponse = await response.json();
                    console.log('Fetched client data:', data);
                    
                    if (data.data?.mobile) {
                        setValue('mobile', data.data.mobile, { shouldValidate: true });
                        setIsMobileDisabled(true);
                    }
                    
                    if (data.data?.email) {
                        setValue('email', data.data.email, { shouldValidate: true });
                        setIsEmailDisabled(true);
                        console.log('Email set to:', data.data.email);
                    }
                }
            } catch (error) {
                console.error('Error fetching client data:', error);
            }
        };

        fetchClientData();
    }, [showDialog, setValue]);

    // Check if this is first booking
    useEffect(() => {
        const checkFirstBooking = async () => {
            if (hasRequestedRef.current) {
                return;
            }

            if (!isAuthenticated()) {
                setIsLoading(false);
                return;
            }

            hasRequestedRef.current = true;
            const startTime = Date.now();
            const minLoadingTime = 3000;

            try {
                const authHeader = getAuthHeader();
                const response = await fetch(URL('/clients/validate-completed-data'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...authHeader,
                    },
                });

                if (response.ok) {
                    const data: ValidateCompletedDataResponse = await response.json();
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
                    await new Promise(resolve => setTimeout(resolve, remainingTime));

                    if (data.data === false) {
                        setShowDialog(true);
                    }
                }
            } catch (error) {
                console.error('Error checking first booking:', error);
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            } finally {
                setIsLoading(false);
            }
        };

        checkFirstBooking();
    }, []);

    // Handle form submission
    const onSubmit = async (data: FormData) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const authHeader = getAuthHeader();
            const formattedBirthdate = format(data.birthdate!, 'yyyy-MM-dd');
            const formattedLicenseExpiration = format(data.licenseExpiration!, 'yyyy-MM-dd');

            // Upload license image if provided (licenseNumber contains the File object)
            let licenseImageFilename = '';
            if (data.licenseNumber && data.licenseNumber instanceof File) {
                try {
                    licenseImageFilename = await uploadImage(data.licenseNumber);
                } catch (error) {
                    console.error('Image upload error:', error);
                    toast.error(locale === 'ar' ? 'فشل في رفع صورة الرخصة' : 'Failed to upload license image');
                    setIsSubmitting(false);
                    return;
                }
            }

            const requestData: CompleteDataRequest = {
                birthdate: formattedBirthdate,
                licenseExpiration: formattedLicenseExpiration,
                gender: data.gender,
                clientType: data.clientType,
                copyNum: data.copyNum || '',
                nationality: data.nationality,
                nationalId: data.nationalId,
                mobile: data.mobile.replace(/[\s\-\(\)]/g, ''),
                email: data.email || '',
                licenseNumber: licenseImageFilename || '',
            };

            console.log('Form data:', data);
            console.log('Request data:', requestData);

            const response = await fetch(URL('/clients/complete-data'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader,
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const responseData = await response.json();
                
                if (responseData.message === 'SUCCESS' || responseData.data === 'Data Completed Successfully') {
                    toast.success(locale === 'ar' ? 'تم إرسال البيانات بنجاح' : 'Data submitted successfully');
                    setShowDialog(false);
                    reset();
                } else {
                    // Handle non-success messages from API
                    const apiMessage = responseData.message || 'DEFAULT';
                    const translatedMessage = tValidation(apiMessage as any) || apiMessage;
                    toast.error(translatedMessage);
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: 'DEFAULT' }));
                const apiMessage = errorData.message || 'DEFAULT';
                const translatedMessage = tValidation(apiMessage as any) || apiMessage;
                toast.error(translatedMessage);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            const errorMessage = error instanceof Error ? error.message : 'DEFAULT';
            const translatedMessage = tValidation(errorMessage as any) || tValidation('DEFAULT');
            toast.error(translatedMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // State
        showDialog,
        isLoading,
        isSubmitting,
        isMobileDisabled,
        isEmailDisabled,
        clientType,
        
        // Form
        control,
        handleSubmit,
        errors,
        watch,
        setValue,
        reset,
        trigger,
        
        // Handlers
        onSubmit,
        setShowDialog,
    };
}

