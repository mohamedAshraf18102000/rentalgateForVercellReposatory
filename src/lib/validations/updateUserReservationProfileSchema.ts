import { z } from "zod";

const isValidDateInput = (val: unknown) => {
  if (val instanceof Date) return !Number.isNaN(val.getTime());
  if (typeof val === "string" && val.trim()) {
    return !Number.isNaN(new Date(val).getTime());
  }
  return false;
};

const phoneRegex = /^\+?[0-9]{8,15}$/;

export const updateUserReservationProfileSchema = z
  .object({
    fullName: z.string().min(1, "validation.fullNameRequired"),
    email: z
      .string()
      .min(1, "validation.emailRequired")
      .email("validation.emailInvalid"),
    mobile: z
      .string()
      .min(1, "validation.mobileRequired")
      .refine((val) => phoneRegex.test(val.trim()), {
        message: "validation.mobileInvalid",
      }),
    idNumber: z.string().min(1, "validation.residenceTypeRequired"),
    nationality: z.string().min(1, "validation.nationalityRequired"),
    personalId: z.string().optional(),
    passportNumber: z.string().optional(),
    borderNumber: z.string().optional(),
    identityExpiryDate: z
      .any()
      .refine((val) => isValidDateInput(val), {
        message: "validation.identityExpiryDateRequired",
      }),
    licenseImage: z.string().min(1, "validation.licenseImageRequired"),
    licenceExpiryDate: z
      .any()
      .refine((val) => isValidDateInput(val), {
        message: "validation.licenseExpiryDateRequired",
      }),
  })
  .superRefine((data, ctx) => {
    if ((data.idNumber === "0" || data.idNumber === "1") && !data.personalId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validation.personalIdRequired",
        path: ["personalId"],
      });
    }

    if (data.idNumber === "2" && !data.passportNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validation.passportNumberRequired",
        path: ["passportNumber"],
      });
    }

    if (data.idNumber === "3" && !data.borderNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "validation.borderNumberRequired",
        path: ["borderNumber"],
      });
    }
  });

export type UpdateUserReservationProfileFormValues = z.infer<
  typeof updateUserReservationProfileSchema
>;

export const updateUserReservationProfileDefaultValues: UpdateUserReservationProfileFormValues =
  {
    fullName: "",
    email: "",
    mobile: "",
    idNumber: "0",
    nationality: "",
    personalId: "",
    passportNumber: "",
    borderNumber: "",
    identityExpiryDate: undefined,
    licenseImage: "",
    licenceExpiryDate: undefined,
  };

export const mergeUpdateUserReservationProfileFormValues = (
  values?: Partial<UpdateUserReservationProfileFormValues>,
): UpdateUserReservationProfileFormValues => ({
  ...updateUserReservationProfileDefaultValues,
  ...values,
  fullName: values?.fullName ?? "",
  email: values?.email ?? "",
  mobile: values?.mobile ?? "",
  idNumber: values?.idNumber ?? "0",
  nationality: values?.nationality ?? "",
  personalId: values?.personalId ?? "",
  passportNumber: values?.passportNumber ?? "",
  borderNumber: values?.borderNumber ?? "",
  licenseImage: values?.licenseImage ?? "",
});
