import { z } from "zod";

export const createBusinessAccountSchema = z.object({
  responsableName: z.string().min(2, "اسم المسئول مطلوب"),
  responsableMobile: z
    .string()
    .min(4, "رقم الجوال مطلوب")
    .min(13, "رقم الجوال غير صحيح، يجب ألا يقل عن 9 أرقام"),
  companyName: z.string().min(2, "اسم الشركة مطلوب"),
  empsNumber: z.number().min(1, "عدد الموظفين مطلوب"),
  taxImage: z.string().min(1, "صورة البطاقة الضريبية مطلوبة"),
  registrationImage: z.string().min(1, "صورة السجل التجاري مطلوبة"),
  notes: z.string(),
  discountPercentage: z.number(),
  registrationNumber: z.string(),
  taxNumber: z.string(),
});
