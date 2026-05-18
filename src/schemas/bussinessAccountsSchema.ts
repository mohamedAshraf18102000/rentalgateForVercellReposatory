import { z } from "zod";

export type BusinessAccountSchemaMessages = {
  responsibleNameRequired: string;
  mobileRequired: string;
  mobileInvalid: string;
  companyNameRequired: string;
  employeesNumberRequired: string;
  taxImageRequired: string;
  registrationImageRequired: string;
};

export const createBusinessAccountSchema = (
  messages: BusinessAccountSchemaMessages,
) =>
  z.object({
    responsableName: z.string().min(2, messages.responsibleNameRequired),
    responsableMobile: z
      .string()
      .min(4, messages.mobileRequired)
      .min(13, messages.mobileInvalid),
    companyName: z.string().min(2, messages.companyNameRequired),
    empsNumber: z.number().min(1, messages.employeesNumberRequired),
    taxImage: z.string().min(1, messages.taxImageRequired),
    registrationImage: z.string().min(1, messages.registrationImageRequired),
    notes: z.string(),
    discountPercentage: z.number(),
    registrationNumber: z.string(),
    taxNumber: z.string(),
  });

export type CreateBusinessAccountFormValues = z.infer<
  ReturnType<typeof createBusinessAccountSchema>
>;
