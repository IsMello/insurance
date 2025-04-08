import { handler } from '../../src/api/handlers/get-quote';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const DEFAULT_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
describe('get-quote handler', () => {
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

  it('should return an error if the request body is empty', async () => {
    const event = { body: null } as unknown as APIGatewayProxyEventV2;
    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 400,
     headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        message: "Invalid request",
        error: { message: 'Request body is empty.' },
      }),
    });
  });

  it('should return an error for an unknown productId', async () => {
    const event = mockEvent({ productId: 'unknown-product' });
    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 400,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        message: 'Invalid request',
        error: { message: 'Unknown productId: unknown-product' },
      }),
    });
  });

  it('should return an error for an invalid request schema', async () => {
    const event = mockEvent({ productId: 'term-life', invalidField: 'invalid' });
    const response = await handler(event);
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body as string);
    expect(body.error).toBeDefined();
  });

  it('should return a valid quote for term-life', async () => {
    const event = mockEvent({ 
        productId: 'term-life', 
        state: "PA",
        sex: "M",
        dateOfBirth: "1970-01-01",
        amount: 25000000,
        benefitType: "LS",
        mode: "M",
        riders: ["child", "chronic"]
    });
    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 200,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
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
      }),
    });
  });

  it('should return a valid quote for disability', async () => {
    const event = mockEvent({ 
        productId: 'disability', 
        state: "PA",
        sex: "M",
        dateOfBirth: "1970-01-01",
        amount: 25000000,
        benefitType: "LS",
        mode: "M",
        riders: ["child", "chronic"],
        annualIncome: 10000000,
        smoker: false,
        eliminationPeriod: "90"
        });
    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 200,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
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
      }),
    });
  });

  it('should handle internal server errors gracefully', async () => {
    const event = mockEvent({ productId: 'term-life' });
    jest.spyOn(JSON, 'parse').mockImplementationOnce(() => {
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