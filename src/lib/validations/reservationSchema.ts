import { z } from "zod";

export const reservationSchema = z
  .object({
    // Step 1
    pickupName: z
      .string()
      .min(1, "يجب تحديد مكان الاستلام")
      .refine((val) => val !== "الموقع الحالي", {
        message: "الرجاء تحديد موقع الاستلام ",
      }),
    carReturnLocation: z
      .string()
      .min(1, "يجب تحديد مكان التسليم")
      .refine((val) => val !== "الموقع الحالي", {
        message: "الرجاء تحديد موقع التسليم ",
      }),
    pickupLat: z.number().optional().nullable(),
    pickupLong: z.number().optional().nullable(),
    pickupId: z.string().optional().nullable(),
    returnLat: z.number().optional().nullable(),
    returnLong: z.number().optional().nullable(),
    carReturnLocationId: z.string().optional().nullable(),
    fromDate: z
      .any()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "يجب تحديد تاريخ الاستلام",
      }),
    toDate: z
      .any()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "يجب تحديد تاريخ التسليم",
      }),

    // Step 2 - Tenant Details
    idNumber: z.string().min(1, "يجب إدخال نوع الإقامة"),
    nationality: z.string().min(1, "يجب إدخال الجنسية"),
    personalId: z.string().optional(),
    passportNumber: z.string().optional(),
    borderNumber: z.string().optional(),
    licenseImage: z.string().min(1, "يجب إرفاق صورة الرخصة"),
    licenceExpiryDate: z
      .any()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "يجب تحديد تاريخ انتهاء الرخصة",
      }),

    // Step 3 - Additional Services (Can be optional/required)
    // For now, let's keep it simple
    services: z.array(z.number()).optional(),
    driver: z
      .object({
        id: z.number(),
        hours: z.number(),
        days: z.number(),
        type: z.enum(["in", "out"]).optional(),
      })
      .nullable()
      .optional(),
    extraKmType: z.enum(["UNLIMITED", "QUOTA"]).optional(),
  })
  .superRefine((data, ctx) => {
    // 0: Citizen, 1: Resident, 2: Visitor, 3: Gulf Citizen

    // Personal ID is required for 0, 1, and 3
    if (data.idNumber !== "2") {
      if (!data.personalId || data.personalId.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "يجب إدخال بطاقة تحقيق الشخصية",
          path: ["personalId"],
        });
      }
    }

    // Passport number is required for 2 and 3
    if (data.idNumber === "2" || data.idNumber === "3") {
      if (!data.passportNumber || data.passportNumber.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "يجب إدخال رقم الباسبور",
          path: ["passportNumber"],
        });
      }
    }

    // Border number is required only for 3
    if (data.idNumber === "3") {
      if (!data.borderNumber || data.borderNumber.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "يجب إدخال رقم الحدود",
          path: ["borderNumber"],
        });
      }
    }
  });

export type ReservationFormValues = z.infer<typeof reservationSchema>;
