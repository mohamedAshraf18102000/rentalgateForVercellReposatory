"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Stepper } from "./Stepper";
import { Button } from "@/app/(components)/ui/button";
import { Card, CardContent } from "@/app/(components)/ui/card";
import { useSharedStore } from "@/lib/api/stores/shared.store";
import { URL } from "@/util/api";
import { useFormCookies, FormData } from "../hooks/useFormCookies";
import { validatePhone } from "../utils/validation";
import { Step1, Step2, Step3 } from "./steps";
import { getUserData, isAuthenticated } from "@/util/auth";

interface CompanyQuotationFormProps {
  locale: string;
}

export function CompanyQuotationForm({ locale }: CompanyQuotationFormProps) {
  const t = useTranslations("companyQuotation");
  const isRTL = locale === "ar";

  // Cookie management
  const {
    loadFormData,
    loadStep,
    saveFormData,
    saveStep,
    clearCookies,
  } = useFormCookies();

  // Fetch shared data (brands and cities)
  const {
    sharedData,
    fetchSharedData,
    isLoading: isLoadingSharedData,
  } = useSharedStore();

  // Component state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize react-hook-form
  const {
    control,
    formState: { errors },
    trigger,
    getValues,
    reset,
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      companyName: "",
      activity: "",
      city: "",
      responsibleName: "",
      phone: "",
      email: "",
      rentalDuration: 1,
      selectedBrandId: [],
      numberOfCars: 1,
    },
  });

  // Fetch shared data on mount
  useEffect(() => {
    if (!sharedData) {
      fetchSharedData();
    }
  }, [sharedData, fetchSharedData]);

  // Load saved form data and step on mount (only once)
  useEffect(() => {
    if (!isInitialized) {
      const savedData = loadFormData();
      const savedStep = loadStep();

      // Get user data if authenticated
      const userData = isAuthenticated() ? getUserData() : null;
      
      // Prepare form values - prioritize saved data, then user data, then defaults
      const formValues: Partial<FormData> = { ...savedData };

      // If user is authenticated and fields are empty, fill from user data
      if (userData) {
        // Fill responsibleName from firstName + lastName or firstName only
        if (!formValues.responsibleName && (userData.firstName || userData.lastName)) {
          const fullName = [userData.firstName, userData.lastName]
            .filter(Boolean)
            .join(' ')
            .trim();
          if (fullName) {
            formValues.responsibleName = fullName;
          }
        }

        // Fill phone from mobile
        if (!formValues.phone && userData.mobile) {
          formValues.phone = userData.mobile;
        }

        // Fill email
        if (!formValues.email && userData.email) {
          formValues.email = userData.email;
        }
      }

      // Restore form values
      if (Object.keys(formValues).length > 0) {
        Object.entries(formValues).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            setValue(key as keyof FormData, value as any, {
              shouldValidate: false,
              shouldDirty: false,
              shouldTouch: false,
            });
          }
        });
      }

      // Validate phone if filled from user data
      if (formValues.phone && userData) {
        const isValid = validatePhone(formValues.phone);
        setPhoneValid(isValid);
      }

      // Restore step
      setCurrentStep(savedStep);
      setIsInitialized(true);
    }
  }, [isInitialized, loadFormData, loadStep, setValue]);

  // Handle field changes and save to cookies
  const handleFieldChange = (field: keyof FormData, value: any) => {
    if (!isInitialized) return;

    // Get current form values and update with new value
    const currentValues = getValues();
    const updatedValues = { ...currentValues, [field]: value };

    // Save to cookies
    saveFormData(updatedValues);
  };

  // Save step to cookies when it changes
  useEffect(() => {
    if (isInitialized) {
      saveStep(currentStep);
    }
  }, [currentStep, isInitialized, saveStep]);

  // Steps configuration
  const steps = [
    {
      number: 1,
      title: t("step1.title"),
      subtitle: t("step1.subtitle"),
    },
    {
      number: 2,
      title: t("step2.title"),
      subtitle: t("step2.subtitle"),
    },
    {
      number: 3,
      title: t("step3.title"),
      subtitle: t("step3.subtitle"),
    },
  ];

  // Navigation handlers
  const handleNext = async () => {
    if (currentStep >= 3) return;

    let fieldsToValidate: (keyof FormData)[] = [];

    // Determine which fields to validate based on current step
    if (currentStep === 1) {
      fieldsToValidate = ["companyName", "activity", "city"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["responsibleName", "phone", "email"];
    }

    // Trigger validation
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      toast.error(
        isRTL
          ? "يرجى إكمال جميع الحقول المطلوبة بشكل صحيح"
          : "Please complete all required fields correctly"
      );
      return;
    }

    // Additional validation for phone in step 2
    if (currentStep === 2) {
      const phoneValue = getValues("phone");
      if (!phoneValue || !validatePhone(phoneValue)) {
        toast.error(
          isRTL
            ? "يرجى إدخال رقم هاتف صحيح"
            : "Please enter a valid phone number"
        );
        return;
      }
    }

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission handler
  const onSubmit = async () => {
    // Validate all fields
    const isValid = await trigger();
    if (!isValid) {
      toast.error(
        isRTL
          ? "يرجى إكمال جميع الحقول المطلوبة بشكل صحيح"
          : "Please complete all required fields correctly"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = getValues();

      // Validate phone
      if (!formData.phone || !validatePhone(formData.phone)) {
        toast.error(
          isRTL ? "رقم الهاتف غير صحيح" : "Invalid phone number"
        );
        setIsSubmitting(false);
        return;
      }

      // Validate brand selection
      if (!formData.selectedBrandId || formData.selectedBrandId.length === 0) {
        toast.error(
          isRTL ? "يرجى اختيار الماركة" : "Please select a brand"
        );
        setIsSubmitting(false);
        return;
      }

      // Prepare payload
      const payload = {
        companyName: formData.companyName.trim(),
        activity: formData.activity.trim(),
        city: formData.city.trim(),
        responsibleName: formData.responsibleName.trim(),
        mobile: formData.phone.replace(/[\s\-\(\)]/g, ""),
        email: formData.email.trim(),
        notes: "",
        carsNumber: Number(formData.numberOfCars) || 1,
        months: Number(formData.rentalDuration) || 1,
        brandIds: formData.selectedBrandId.map((id) => parseInt(id, 10)),
      };

      // Submit request
      const response = await fetch(URL("/company-requests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          (isRTL ? "فشل في إرسال الطلب" : "Failed to submit request")
        );
      }

      // Success
      toast.success(
        isRTL ? "تم إرسال الطلب بنجاح" : "Request submitted successfully"
      );

      // Clear cookies and reset form
      clearCookies();
      reset();
      setCurrentStep(1);
      setPhoneValid(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : isRTL
            ? "حدث خطأ غير متوقع"
            : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            control={control}
            errors={errors}
            isRTL={isRTL}
            onFieldChange={handleFieldChange}
          />
        );
      case 2:
        return (
          <Step2
            control={control}
            errors={errors}
            isRTL={isRTL}
            phoneValid={phoneValid}
            onPhoneValidChange={setPhoneValid}
            onFieldChange={handleFieldChange}
          />
        );
      case 3:
        return (
          <Step3
            control={control}
            errors={errors}
            isRTL={isRTL}
            brands={sharedData?.carBrands || []}
            isLoadingBrands={isLoadingSharedData}
            onFieldChange={handleFieldChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#ECEEF2] min-h-screen py-4 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Stepper */}
        <Stepper steps={steps} currentStep={currentStep} locale={locale} />

        {/* Form Content */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6 bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
          {/* Form Panel - First */}
          <div className="col-span-12 lg:col-span-7 order-1">
            <div className="bg-white rounded-lg border-0 ">
              <CardContent className="p-">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 w-full sm:w-auto min-h-[48px] sm:min-h-[44px] text-base sm:text-sm font-medium touch-manipulation active:scale-[0.98] transition-transform"
                      size="lg"
                    >
                      {t("buttons.back")}
                    </Button>
                  )}
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 w-full sm:w-auto min-h-[48px] sm:min-h-[44px] bg-[#DC340A] hover:bg-primary-hover active:bg-[#B02A08] text-white text-base sm:text-sm font-medium touch-manipulation active:scale-[0.98] transition-transform shadow-sm hover:shadow-md"
                      size="lg"
                    >
                      {t("buttons.next")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={onSubmit}
                      className="flex-1 w-full sm:w-auto min-h-[48px] sm:min-h-[44px] bg-[#DC340A] hover:bg-primary-hover active:bg-[#B02A08] disabled:opacity-50 disabled:cursor-not-allowed text-white text-base sm:text-sm font-medium touch-manipulation active:scale-[0.98] transition-transform shadow-sm hover:shadow-md"
                      size="lg"
                      disabled={isSubmitting || isLoadingSharedData}
                    >
                      {isSubmitting ? (isRTL ? "جاري الإرسال..." : "Submitting...") : t("buttons.submit")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
          {/* Info Panel - Second */}
          <div className="col-span-12 lg:col-span-5 order-2">
            <div className="bg-[#ECEEF2] rounded-lg shadow-sm border-0 mb-4 lg:mb-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                  {t("info.title")}
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  <p>{t("info.description1")}</p>
                  <p>{t("info.description2")}</p>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

