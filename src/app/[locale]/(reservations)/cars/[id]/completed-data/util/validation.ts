// Validation rules for first booking form

// Validate Saudi National ID (Citizen) - starts with 1
export const validateSaudiNationalId = (id: string): boolean => {
  if (!/^\d{10}$/.test(id)) return false;
  if (id[0] !== '1') return false;
  return true;
};

// Validate Saudi Residence ID (Resident) - starts with 2
export const validateSaudiResidenceId = (id: string): boolean => {
  if (!/^\d{10}$/.test(id)) return false;
  if (id[0] !== '2') return false;
  return true;
};

// Validate Saudi Visitor ID - starts with 3
export const validateSaudiVisitorId = (id: string): boolean => {
  if (!/^\d{10}$/.test(id)) return false;
  if (id[0] !== '3') return false;
  return true;
};

// Validate passport number (Visitor)
export const validatePassportNumber = (passport: string): boolean => {
  const passportRegex = /^[A-Z0-9]{6,9}$/i;
  return passportRegex.test(passport);
};

// Validate Saudi License
export const validateSaudiLicense = (license: string): boolean => {
  const licenseRegex = /^\d{10}$/;
  return licenseRegex.test(license);
};

// Validate Copy Number
export const validateCopyNumber = (copyNum: string): boolean => {
  const copyRegex = /^[1-9][0-9]?$/;
  return copyRegex.test(copyNum) && parseInt(copyNum) <= 99;
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Validate birthdate (must be in past and age >= 21) - same as الغزال
export const validateBirthdate = (date: Date | undefined): { valid: boolean; error?: string } => {
  if (!date) {
    return { valid: false, error: 'تاريخ الميلاد مطلوب' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birthDate = new Date(date);
  birthDate.setHours(0, 0, 0, 0);

  // Check if date is before today
  const isBeforeToday = birthDate < today;

  if (!isBeforeToday) {
    return { valid: false, error: 'تاريخ الميلاد يجب أن يكون في الماضي' };
  }

  // Calculate age
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Check if age is 21 or over
  const isOver21 = age > 21 || (age === 21 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

  if (!isOver21) {
    return { valid: false, error: 'العمر يجب أن يكون 21 سنة على الأقل' };
  }

  return { valid: true };
};

// Validate license expiration (must be in future)
export const validateLicenseExpiration = (date: Date | undefined): { valid: boolean; error?: string } => {
  if (!date) {
    return { valid: false, error: 'تاريخ انتهاء الرخصة مطلوب' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationDate = new Date(date);
  expirationDate.setHours(0, 0, 0, 0);

  if (expirationDate <= today) {
    return { valid: false, error: 'تاريخ الرخصة يجب أن يكون في المستقبل' };
  }

  return { valid: true };
};

// Validation functions for each field type
export const validateCitizenNationalId = (id: string): { valid: boolean; error?: string } => {
  if (!id) {
    return { valid: false, error: 'رقم الهوية مطلوب' };
  }
  if (!validateSaudiNationalId(id)) {
    return { valid: false, error: 'رقم الهوية السعودية غير صالح ' };
  }
  return { valid: true };
};

export const validateResidentId = (id: string): { valid: boolean; error?: string } => {
  if (!id) {
    return { valid: false, error: 'رقم الإقامة مطلوب' };
  }
  if (!validateSaudiResidenceId(id)) {
    return { valid: false, error: 'رقم الإقامة السعودية غير صالح  ' };
  }
  return { valid: true };
};

export const validateVisitorNationalId = (id: string): { valid: boolean; error?: string } => {
  if (!id) {
    return { valid: false, error: 'رقم الهوية مطلوب' };
  }
  // Visitor ID validation is optional based on the rules file
  return { valid: true };
};

export const validatePassport = (passport: string): { valid: boolean; error?: string } => {
  if (!passport) {
    return { valid: false, error: 'رقم جواز السفر مطلوب' };
  }
  if (!validatePassportNumber(passport)) {
    return { valid: false, error: 'رقم جواز السفر غير صالح (6-9 أحرف، أرقام وحروف فقط)' };
  }
  return { valid: true };
};

export const validateLicenseNumber = (license: string): { valid: boolean; error?: string } => {
  if (!license) {
    return { valid: false, error: 'صورة الرخصة مطلوبة' };
  }
  // License validation is optional based on the rules file
  return { valid: true };
};

export const validateCopyNum = (copyNum: string): { valid: boolean; error?: string } => {
  if (!copyNum || !copyNum.trim()) {
    return { valid: true };
  }
  // if (!validateCopyNumber(copyNum)) {
  //   return { valid: false, error: 'رقم النسخة غير صالح' };
  // }
  return { valid: true };
};

export const validateEmailField = (email: string): { valid: boolean; error?: string } => {
  if (!email) {
    return { valid: false, error: 'البريد الإلكتروني مطلوب' };
  }
  if (!validateEmail(email)) {
    return { valid: false, error: 'البريد الإلكتروني غير صالح' };
  }
  return { valid: true };
};

export const validateMobile = (mobile: string): { valid: boolean; error?: string } => {
  if (!mobile) {
    return { valid: false, error: 'رقم الجوال مطلوب' };
  }
  // Mobile validation is optional based on the rules file
  return { valid: true };
};

export const validateNationality = (nationality: string): { valid: boolean; error?: string } => {
  if (!nationality) {
    return { valid: false, error: 'الجنسية مطلوبة' };
  }
  return { valid: true };
};

