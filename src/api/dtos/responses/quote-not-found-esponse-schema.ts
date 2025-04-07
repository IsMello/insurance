import { z } from 'zod';
import { responseHeadersSchema } from './response-headers-schema';

export const quoteNotFoundSchema = z.object({
    statusCode: z.number().default(404),
    headers: responseHeadersSchema,
    body: z.object({ message: z.string().default('Quote not found') }),
})

