import { z } from 'zod';

export const getTermLifeQuoteRequestSchema = z
  .object({
    productId: z.string(),
    state: z.string(),
    sex: z.string().max(1),
    dateOfBirth: z.coerce.date(),
    amount: z.number(),
    benefitType: z.string(),
    mode: z.string(),
    riders: z.string().array(),
  })
  .strict();

export const getDisabilityQuoteRequestSchema = getTermLifeQuoteRequestSchema
  .extend({
    annualIncome: z.number(),
    smoker: z.boolean(),
    eliminationPeriod: z.string(),
  })
  .strict();
