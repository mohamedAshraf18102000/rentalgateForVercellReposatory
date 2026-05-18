import { z } from "zod";

export type UserSavedLocationSchemaMessages = {
  addressNameRequired: string;
  mobileRequired: string;
};

export const createUserSavedLocationSchema = (
  messages: UserSavedLocationSchemaMessages,
) =>
  z.object({
    addressName: z.string().min(1, messages.addressNameRequired),
    addressType: z.string().optional().or(z.literal("")),
    street: z.string().optional().or(z.literal("")),
    buildingNo: z.string().optional().or(z.literal("")),
    floor: z.number().optional().or(z.literal(0)),
    flatNo: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    additionalInfo: z.string().optional().or(z.literal("")),
    mobile: z.string().min(8, messages.mobileRequired),
    notes: z.string().optional().or(z.literal("")),
  });

export type UserSavedLocationFormValues = z.infer<
  ReturnType<typeof createUserSavedLocationSchema>
>;
