import { z } from 'zod';
import { responseHeadersSchema } from './response-headers-schema';

export const invalidRequestResponseSchema = z.object({
    statusCode: z.number().default(400),
    headers: responseHeadersSchema,
    body: z.object({ 
        message: z.string().default('Invalid request'), 
        error: z.union([
            z.array(
                z.object({
                    code: z.string(),
                    expected: z.string().optional(),
                    received: z.string().optional(),
                    path: z.string().array(),
                    message: z.string(),
                })
            ),
            z.object({ message: z.string() })
        ])
    
    }),
})

