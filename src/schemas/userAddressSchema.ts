import { z } from "zod";

export const userSavedLocationSchema = z.object({
  addressName: z.string().min(1, "اسم المكان مطلوب"),
  addressType: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  buildingNo: z.string().optional().or(z.literal("")),
  floor: z.number().optional().or(z.literal(0)),
  flatNo: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  additionalInfo: z.string().optional().or(z.literal("")),
  mobile: z.string().min(8, "رقم الجوال مطلوب"),
  notes: z.string().optional().or(z.literal("")),
});

export type UserSavedLocationFormValues = z.infer<typeof userSavedLocationSchema>;
