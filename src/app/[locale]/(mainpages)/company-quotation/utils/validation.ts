import { isValidPhoneNumber } from "libphonenumber-js";

export interface ValidationMessages {
  companyName: {
    required: string;
    minLength: string;
  };
  activity: {
    required: string;
    minLength: string;
  };
  city: {
    required: string;
    minLength: string;
  };
  responsibleName: {
    required: string;
    minLength: string;
  };
  phone: {
    required: string;
    invalid: string;
  };
  email: {
    required: string;
    invalid: string;
  };
  rentalDuration: {
    min: string;
  };
  selectedBrandId: {
    required: string;
  };
  numberOfCars: {
    min: string;
  };
}

export function getValidationMessages(isRTL: boolean): ValidationMessages {
  return {
    companyName: {
      required: isRTL ? "اسم الشركة مطلوب" : "Company name is required",
      minLength: isRTL
        ? "اسم الشركة يجب أن يكون على الأقل حرفين"
        : "Company name must be at least 2 characters",
    },
    activity: {
      required: isRTL ? "النشاط مطلوب" : "Activity is required",
      minLength: isRTL
        ? "النشاط يجب أن يكون على الأقل حرفين"
        : "Activity must be at least 2 characters",
    },
    city: {
      required: isRTL ? "المدينة مطلوبة" : "City is required",
      minLength: isRTL
        ? "اسم المدينة يجب أن يكون على الأقل حرفين"
        : "City name must be at least 2 characters",
    },
    responsibleName: {
      required: isRTL ? "اسم المسؤول مطلوب" : "Responsible name is required",
      minLength: isRTL
        ? "اسم المسؤول يجب أن يكون على الأقل حرفين"
        : "Responsible name must be at least 2 characters",
    },
    phone: {
      required: isRTL ? "رقم الهاتف مطلوب" : "Phone number is required",
      invalid: isRTL ? "  " : " ",
    },
    email: {
      required: isRTL ? "البريد الإلكتروني مطلوب" : "Email is required",
      invalid: isRTL
        ? "يرجى إدخال بريد إلكتروني صحيح"
        : "Please enter a valid email address",
    },
    rentalDuration: {
      min: isRTL
        ? "المدة يجب أن تكون شهر على الأقل"
        : "Duration must be at least 1 month",
    },
    selectedBrandId: {
      required: isRTL ? "يرجى اختيار الماركة" : "Please select a brand",
    },
    numberOfCars: {
      min: isRTL
        ? "عدد السيارات يجب أن يكون سيارة واحدة على الأقل"
        : "Number of cars must be at least 1",
    },
  };
}

export function validatePhone(value: string): boolean {
  if (!value) return false;
  return isValidPhoneNumber(value);
}

export function validateEmail(value: string): boolean {
  if (!value) return false;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value);
}

