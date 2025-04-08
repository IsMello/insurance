import { z } from 'zod';
import { responseHeadersSchema } from './response-headers-schema';

export const quoteSchema = z.object({
    rateTable: z.object({
        rateClass: z.string(),
    }).catchall(z.number()).array()})

export const getQuoteResponseSchema = z.object({
    statusCode: z.number().default(200),
    headers: responseHeadersSchema,
    body: quoteSchema,
});

