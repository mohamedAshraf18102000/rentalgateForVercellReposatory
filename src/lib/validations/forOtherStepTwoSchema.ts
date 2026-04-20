import { z } from "zod";

export const forOtherStepTwoSchema = z
  .object({
    OtherPersonName: z.string().trim().min(1, "يجب إدخال الاسم"),
    OtherPersonPhoneNumber: z
      .string()
      .trim()
      .min(1, "يجب إدخال رقم الجوال")
      .regex(/^\+?[0-9]{8,15}$/, "رقم الجوال غير صالح"),
    OtherPersonLicenseImage: z.string().min(1, "يجب إرفاق صورة الرخصة"),
    OtherPersonalId: z.string().min(1, "يجب إدخال رقم الهوية"),
  })

export type ForOtherStepTwoFormValues = z.infer<typeof forOtherStepTwoSchema>;
