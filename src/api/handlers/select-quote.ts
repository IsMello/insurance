import { apiGatewayHandler } from '../utils/api-gateway-handler';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { selectQuoteRequestSchema } from '../dtos/requests/select-quote-resquest-schema';
import { invalidRequestResponseSchema } from '../dtos/responses/invalid-request-response-schema';
import { quoteNotFoundSchema } from '../dtos/responses/quote-not-found-esponse-schema';
import { selectQuoteRateResponseSchema } from '../dtos/responses/select-quote-response-schema';
import { internalServerErrorSchema } from '../dtos/responses/internal-server-error-response-schema';
import { SafeParseReturnType } from 'zod';
import { knexClient as knex } from '../clients/knex';

type SelectedQuoteRate = {
  coverage_period: string;
  premium: number;
  rate_class: string;
};

export const handler = apiGatewayHandler(
  async (event: APIGatewayProxyEventV2) => {
    try {
      if (!event.body) {
        return invalidRequestResponseSchema.parse({
          body: { error: { message: 'Request body is empty.' } },
        });
      }

      const parsedBody = JSON.parse(event.body);
      const requestBodyValidation: SafeParseReturnType<any, any> =
        selectQuoteRequestSchema.safeParse(parsedBody);

      if (!requestBodyValidation.success) {
        return invalidRequestResponseSchema.parse({
          body: { error: requestBodyValidation.error.errors },
        });
      }
      const { coveragePeriod, rateClass, selectedPremium } = parsedBody;

      const rawResult = await knex.raw(
        ` 
            SELECT r.coverage_period, r.premium, rc.rate_class
            FROM quotes_test_db.rates r
            JOIN rate_classes rc ON r.rate_class_id = rc.id
            WHERE rc.rate_class = ?
            AND r.coverage_period = ?
            AND r.premium = ?`,
        [rateClass, coveragePeriod, selectedPremium],
      );

      const selectedQuoteRate: SelectedQuoteRate[] = rawResult[0];

      if (selectedQuoteRate.length === 0 || !selectedQuoteRate[0]) {
        return quoteNotFoundSchema.parse({
          body: { message: 'Selected Quote Rate was not found.' },
        });
      }

      const { coverage_period, premium, rate_class } = selectedQuoteRate[0];

      return selectQuoteRateResponseSchema.parse({
        body: {
          message: 'Quote selected successfully!',
          coveragePeriod: coverage_period,
          premium: Number(premium),
          rateClass: rate_class,
        },
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
