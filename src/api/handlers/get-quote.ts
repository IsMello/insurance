import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { apiGatewayHandler } from '../utils/api-gateway-handler';
import {
  getTermLifeQuoteRequestSchema,
  getDisabilityQuoteRequestSchema,
} from '../dtos/requests/get-quote-request-schema';
import { getQuoteResponseSchema } from '../dtos/responses/get-quote-response-schema';
import { invalidRequestResponseSchema } from '../dtos/responses/invalid-request-response-schema';
import { internalServerErrorSchema } from '../dtos/responses/internal-server-error-response-schema';
import { quoteNotFoundSchema } from '../dtos/responses/quote-not-found-esponse-schema';
import { ZodSchema, SafeParseReturnType } from 'zod';

type InsuranceTypes = 'term-life' | 'disability';
type Quote = {
  rateTable: { rateClass: string; [key: string]: number | string }[];
};

function returnCorrectQuote(type: InsuranceTypes): Quote {
  const quotes: Record<InsuranceTypes, Quote> = {
    'term-life': {
      rateTable: [
        {
          rateClass: 'preferredPlus',
          term10: 4474,
          term15: 4630,
          term20: 4697,
          term30: 4919,
        },
        {
          rateClass: 'standard',
          term10: 5997,
          term15: 6215,
          term20: 6308,
          term30: 6620,
        },
      ],
    },
    disability: {
      rateTable: [
        {
          rateClass: '4A',
          '2BP-30EP': 4474,
          '2BP-90EP': 4630,
          '2BP-180EP': 4697,
          '5BP-90EP': 4919,
          '5BP-180EP': 4999,
        },
        {
          rateClass: '4M',
          '2BP-30EP': 5236,
          '2BP-90EP': 5422,
          '2BP-180EP': 5503,
          '5BP-90EP': 5770,
          '5BP-180EP': 5870,
        },
      ],
    },
  };

  return quotes[type];
}

export const handler = apiGatewayHandler(
  async (event: APIGatewayProxyEventV2) => {
    try {
      if (!event.body) {
        return invalidRequestResponseSchema.parse({
          body: { error: { message: 'Request body is empty.' } },
        });
      }

      const parsedBody = JSON.parse(event.body);

      const schemaMapping: Record<InsuranceTypes, ZodSchema> = {
        'term-life': getTermLifeQuoteRequestSchema,
        disability: getDisabilityQuoteRequestSchema,
      };

      const type: InsuranceTypes = parsedBody.productId as InsuranceTypes;

      if (!schemaMapping[type]) {
        return invalidRequestResponseSchema.parse({
          body: { error: { message: `Unknown productId: ${type}` } },
        });
      }

      const schema: ZodSchema = schemaMapping[type];
      const requestBodyValidation: SafeParseReturnType<any, any> =
        schema.safeParse(parsedBody);

      if (!requestBodyValidation.success) {
        return invalidRequestResponseSchema.parse({
          body: { error: requestBodyValidation.error.errors },
        });
      }

      const quote: Quote = returnCorrectQuote(type);
      if (!quote) {
        return quoteNotFoundSchema.parse({
          body: { message: 'Quote not found.' },
        });
      }

      return getQuoteResponseSchema.parse({
        body: quote,
      });
    } catch (error) {
      return internalServerErrorSchema.parse({
        body: {
          error: (error as Error).message,
        },
      });
    }
  },
);
