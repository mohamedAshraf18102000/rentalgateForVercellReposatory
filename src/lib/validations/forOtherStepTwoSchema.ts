import { z } from "zod";

export type ForOtherStepTwoSchemaMessages = {
  otherPersonNameRequired: string;
  otherPersonPhoneRequired: string;
  otherPersonPhoneInvalid: string;
  otherPersonLicenseImageRequired: string;
  otherPersonalIdRequired: string;
};

export const createForOtherStepTwoSchema = (
  messages: ForOtherStepTwoSchemaMessages,
) =>
  z.object({
    OtherPersonName: z.string().trim().min(1, messages.otherPersonNameRequired),
    OtherPersonPhoneNumber: z
      .string()
      .trim()
      .min(1, messages.otherPersonPhoneRequired)
      .regex(/^\+?[0-9]{8,15}$/, messages.otherPersonPhoneInvalid),
    OtherPersonLicenseImage: z
      .string()
      .min(1, messages.otherPersonLicenseImageRequired),
    OtherPersonalId: z.string().min(1, messages.otherPersonalIdRequired),
  });

export type ForOtherStepTwoFormValues = z.infer<
  ReturnType<typeof createForOtherStepTwoSchema>
>;
