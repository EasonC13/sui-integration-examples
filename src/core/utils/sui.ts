import { ConfigurationError } from 'src/core/errors';

export async function queryEvents(
  packageAddress: string,
  moduleLib: string,
  cursor: string | undefined | null,
  maxTxNumber: number
): Promise<any> {
  if (!process.env.SUI_RPC_ENDPOINT) {
    throw new ConfigurationError('SUI_RPC_ENDPOINT is not configured');
  }
  const endpoint = process.env.SUI_RPC_ENDPOINT;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'suix_queryEvents',
      params: [
        {
          MoveModule: {
            package: packageAddress,
            module: moduleLib,
          },
        },
        cursor,
        maxTxNumber,
      ],
    }),
  });

  const responseObject = await response.json();
  return responseObject.result;
}

export function cleanEventType(eventType: string): string {
  return eventType.substring(eventType.indexOf(':') + 2);
}
