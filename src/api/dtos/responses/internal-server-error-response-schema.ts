import {z} from 'zod';
    
import { responseHeadersSchema } from './response-headers-schema';

export const internalServerErrorSchema = z.object({
  statusCode: z.number().default(500),
  headers: responseHeadersSchema,
  body: z.object({message: z.string().default('Internal Server Error')}),
});

export type InternalServerErrorResponse = z.infer<typeof internalServerErrorSchema>;

export type InternalServerErrorResponseInput = z.input<typeof internalServerErrorSchema>;
