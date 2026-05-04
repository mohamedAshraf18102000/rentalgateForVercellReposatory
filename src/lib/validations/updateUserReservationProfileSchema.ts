import { z } from "zod";

export const updateUserReservationProfileSchema = z
  .object({
    idNumber: z.string().min(1, "validation.residenceTypeRequired"),
    nationality: z.string().min(1, "validation.nationalityRequired"),
    personalId: z.string().optional(),
    passportNumber: z.string().optional(),
    borderNumber: z.string().optional(),
    identity_expiry_date: z
      .any()
      .refine((val) => val instanceof Date && !Number.isNaN(val.getTime()), {
        message: "validation.identityExpiryDateRequired",
      }),
    licenseImage: z.string().min(1, "validation.licenseImageRequired"),
    licenceExpiryDate: z
      .any()
      .refine((val) => val instanceof Date && !Number.isNaN(val.getTime()), {
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
