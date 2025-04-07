import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export const apiGatewayHandler =
(
  handler: (event: APIGatewayProxyEventV2) => Promise<any>,
) =>
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    const DEFAULT_HEADERS = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    const response = await handler(event);

    return {
      ...response,
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(response.body),
    };
  };