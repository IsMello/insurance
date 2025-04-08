import {z} from 'zod';
    
import { responseHeadersSchema } from './response-headers-schema';

export const internalServerErrorSchema = z.object({
  statusCode: z.number().default(500),
  headers: responseHeadersSchema,
  body: z.any().default({ message: 'Internal server error' }),
});

