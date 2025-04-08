import { z } from 'zod';
import { responseHeadersSchema } from './response-headers-schema';

export const selectQuoteRateResponseSchema = z.object({
    statusCode: z.number().default(200),
    headers: responseHeadersSchema,
    body: z.object({
        message: z.string(),
        coveragePeriod: z.string(),
        premium: z.number(),
        rateClass: z.string(),
    }),
});
