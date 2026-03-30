import { z } from "zod";

export const userSavedLocationSchema = z.object({
  addressName: z.string().min(2, "اسم العنوان مطلوب"),
  addressType: z.string().min(1, "نوع العنوان مطلوب"),
  street: z.string().min(2, "اسم الشارع/الحي مطلوب"),
  buildingNo: z.string().min(1, "رقم المبنى مطلوب"),
  floor: z.number().int().min(0, "رقم الطابق مطلوب"),
  flatNo: z.string().min(1, "رقم الشقة مطلوب"),
  address: z.string().min(5, "العنوان التفصيلي مطلوب"),
  latitude: z.number(),
  longitude: z.number(),
  additionalInfo: z.string().optional().or(z.literal("")),
  mobile: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type UserSavedLocationFormValues = z.infer<typeof userSavedLocationSchema>;
