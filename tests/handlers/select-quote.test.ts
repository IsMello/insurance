import { handler } from '../../src/api/handlers/select-quote';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { knexClient as knex } from '../../src/api/clients/knex';

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

jest.mock('../../src/api/clients/knex');

describe('select-quote handler', () => {
  const mockEvent = (body: any): APIGatewayProxyEventV2 => ({
    body: JSON.stringify(body),
    headers: {},
    isBase64Encoded: false,
    rawPath: '',
    rawQueryString: '',
    requestContext: {} as any,
    routeKey: '',
    version: '2.0',
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the request body is empty', async () => {
    const event = { body: null } as unknown as APIGatewayProxyEventV2;
    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 400,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        message: 'Invalid request',
        error: { message: 'Request body is empty.' },
      }),
    });
  });

  it('should return an error for an invalid request schema', async () => {
    const event = mockEvent({ invalidField: 'invalid' });
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body as string);
    expect(body.error).toBeDefined();
  });

  it('should return an error if no matching quote is found', async () => {
    knex.raw = jest.fn().mockResolvedValue([[], []]);

    const event = mockEvent({
      coveragePeriod: 'term10',
      rateClass: 'preferredPlus',
      selectedPremium: 1000,
    });

    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 404,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        message: 'Selected Quote Rate was not found.',
      }),
    });
  });

  it('should return a successful response if a matching quote is found', async () => {
    knex.raw = jest.fn().mockResolvedValue([
      [
        {
          coverage_period: 'term10',
          premium: 1000,
          rate_class: 'preferredPlus',
        },
      ],
      [],
    ]);

    const event = mockEvent({
      coveragePeriod: 'term10',
      rateClass: 'preferredPlus',
      selectedPremium: 1000,
    });

    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 200,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        message: 'Quote selected successfully!',
        coveragePeriod: 'term10',
        premium: 1000,
        rateClass: 'preferredPlus',
      }),
    });
  });

  it('should handle internal server errors gracefully', async () => {
    const event = mockEvent({
      coveragePeriod: 'term10',
      rateClass: 'preferredPlus',
      selectedPremium: 1000,
    });

    jest.spyOn(knex, 'raw').mockImplementationOnce(() => {
      throw new Error('Unexpected error');
    });

    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 500,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        error: 'Unexpected error',
      }),
    });
  });
});
