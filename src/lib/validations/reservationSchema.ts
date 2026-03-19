import { z } from "zod";

export const reservationSchema = z.object({
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
  fromDate: z.any().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
    message: "يجب تحديد تاريخ الاستلام",
  }),
  toDate: z.any().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
    message: "يجب تحديد تاريخ التسليم",
  }),


  // Step 2 - Tenant Details
  fullName: z.string().min(3, "يجب إدخال الاسم الكامل"),
  phoneNumber: z.string().min(9, "يجب إدخال رقم هاتف صحيح"),
  idNumber: z.string().min(5, "يجب إدخال رقم الهوية او الجواز"),
  email: z.string().email("يجب إدخال بريد إلكتروني صحيح"),


  // Step 3 - Additional Services (Can be optional/required)
  // For now, let's keep it simple
  services: z.array(z.string()).optional(),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;
