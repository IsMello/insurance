import { z } from 'zod';

export const responseHeadersSchema = z
  .object({
    'Content-Type': z.string().default('application/json'),
    'Access-Control-Allow-Origin': z.string().default('*')
  })
  .default({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
