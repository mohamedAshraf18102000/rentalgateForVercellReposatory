import { z } from "zod";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";
import { isCurrentLocationPlaceholder } from "@/lib/validations/currentLocationLabels";

export type ReservationSchemaMessages = {
  pickupNameRequired: string;
  pickupNameInvalid: string;
  carReturnLocationRequired: string;
  carReturnLocationInvalid: string;
  fromDateRequired: string;
  toDateRequired: string;
  idNumberRequired: string;
  nationalityRequired: string;
  identityExpiryDateRequired: string;
  licenseImageRequired: string;
  licenceExpiryDateRequired: string;
  minRentalDuration: string;
  otherPersonNameRequired: string;
  otherPersonPhoneRequired: string;
  otherPersonPhoneInvalid: string;
  otherPersonLicenseImageRequired: string;
  otherPersonalIdRequired: string;
  personalIdRequired: string;
  passportNumberRequired: string;
  borderNumberRequired: string;
};

export const createReservationSchema = (messages: ReservationSchemaMessages) =>
  z
    .object({
      // Step 1
      pickupName: z
        .string()
        .min(1, messages.pickupNameRequired)
        .refine((val) => !isCurrentLocationPlaceholder(val), {
          message: messages.pickupNameInvalid,
        }),
      carReturnLocation: z
        .string()
        .min(1, messages.carReturnLocationRequired)
        .refine((val) => !isCurrentLocationPlaceholder(val), {
          message: messages.carReturnLocationInvalid,
        }),
      pickupLat: z.number().optional().nullable(),
      pickupLong: z.number().optional().nullable(),
      pickupId: z.string().optional().nullable(),
      returnLat: z.number().optional().nullable(),
      returnLong: z.number().optional().nullable(),
      carReturnLocationId: z.string().optional().nullable(),
      pickupTrainId: z.number().optional().nullable(),
      pickupAirportId: z.number().optional().nullable(),
      returnTrainId: z.number().optional().nullable(),
      returnAirportId: z.number().optional().nullable(),
      fromDate: z
        .any()
        .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
          message: messages.fromDateRequired,
        }),
      toDate: z
        .any()
        .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
          message: messages.toDateRequired,
        }),

      // Step 2 - Tenant Details
      isForOtherReservation: z.boolean().optional(),
      name: z.string().optional(),
      phoneNumber: z.string().optional(),
      OtherPersonName: z.string().optional(),
      OtherPersonPhoneNumber: z.string().optional(),
      OtherPersonalId: z.string().optional(),
      OtherPersonLicenseImage: z.string().optional(),
      idNumber: z.string().min(1, messages.idNumberRequired),
      nationality: z.string().min(1, messages.nationalityRequired),
      personalId: z.string().optional(),
      passportNumber: z.string().optional(),
      borderNumber: z.string().optional(),
      identityExpiryDate: z
        .any()
        .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
          message: messages.identityExpiryDateRequired,
        }),
      licenseImage: z.string().min(1, messages.licenseImageRequired),
      licenceExpiryDate: z.any().optional(),
      licenseExpirationDate: z.any().optional(),

      // Step 3 - Additional Services (Can be optional/required)
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
      extraKmApplied: z.boolean().optional(),
      extraKmQuotaId: z.number().nullable().optional(),
    })
    .superRefine((data, ctx) => {
      const MIN_RENTAL_MS = 2 * 60 * 60 * 1000;

      const formattedFromDate = formatLocalDateTime(data.fromDate);
      const formattedToDate = formatLocalDateTime(data.toDate);

      if (formattedFromDate && formattedToDate) {
        const normalizedFromDate = new Date(formattedFromDate);
        const normalizedToDate = new Date(formattedToDate);

        if (
          !Number.isNaN(normalizedFromDate.getTime()) &&
          !Number.isNaN(normalizedToDate.getTime()) &&
          normalizedToDate.getTime() - normalizedFromDate.getTime() <
            MIN_RENTAL_MS
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.minRentalDuration,
            path: ["toDate"],
          });
        }
      }

      if (data.isForOtherReservation) {
        if (!data.OtherPersonName || data.OtherPersonName.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.otherPersonNameRequired,
            path: ["OtherPersonName"],
          });
        }

        if (
          !data.OtherPersonPhoneNumber ||
          data.OtherPersonPhoneNumber.trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.otherPersonPhoneRequired,
            path: ["OtherPersonPhoneNumber"],
          });
        } else if (
          !/^\+?[0-9]{8,15}$/.test(data.OtherPersonPhoneNumber.trim())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.otherPersonPhoneInvalid,
            path: ["OtherPersonPhoneNumber"],
          });
        }

        if (
          !data.OtherPersonLicenseImage ||
          data.OtherPersonLicenseImage.trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.otherPersonLicenseImageRequired,
            path: ["OtherPersonLicenseImage"],
          });
        }

        if (!data.OtherPersonalId || data.OtherPersonalId.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.otherPersonalIdRequired,
            path: ["OtherPersonalId"],
          });
        }

        if (
          !(data.identityExpiryDate instanceof Date) ||
          isNaN(data.identityExpiryDate.getTime())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.identityExpiryDateRequired,
            path: ["identityExpiryDate"],
          });
        }

        if (
          !(data.licenseExpirationDate instanceof Date) ||
          isNaN(data.licenseExpirationDate.getTime())
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.licenceExpiryDateRequired,
            path: ["licenseExpirationDate"],
          });
        }
      } else if (
        !(data.licenceExpiryDate instanceof Date) ||
        isNaN(data.licenceExpiryDate.getTime())
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.licenceExpiryDateRequired,
          path: ["licenceExpiryDate"],
        });
      }

      // 0: Citizen, 1: Resident, 2: Visitor, 3: Gulf Citizen
      if (data.idNumber === "0" || data.idNumber === "1") {
        if (!data.personalId || data.personalId.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.personalIdRequired,
            path: ["personalId"],
          });
        }
      }

      if (data.idNumber === "2") {
        if (!data.passportNumber || data.passportNumber.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.passportNumberRequired,
            path: ["passportNumber"],
          });
        }
      }

      if (data.idNumber === "3") {
        if (!data.borderNumber || data.borderNumber.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.borderNumberRequired,
            path: ["borderNumber"],
          });
        }
      }
    });

export type ReservationFormValues = z.infer<
  ReturnType<typeof createReservationSchema>
>;
