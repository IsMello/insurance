import { z } from 'zod';

export const selectQuoteRequestSchema = z.object({
  rateClass: z.string(),
  coveragePeriod: z.string(),
  selectedPremium: z.number(),
});
