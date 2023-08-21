import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import { ConfigurationError } from 'src/core/errors';

export async function createSuiProvider() {
  if (!process.env.RPC_SUI_ENDPOINT) {
    throw new ConfigurationError('RPC_SUI_ENDPOINT is not configured');
  }
  const endpoint = process.env.RPC_SUI_ENDPOINT;
  const connection = new Connection({ fullnode: endpoint });

  return new JsonRpcProvider(connection);
}

export async function queryEvents(
  packageAddress: string,
  cursor: string | undefined | null,
  maxTxNumber: number
) {
  if (!process.env.RPC_SUI_ENDPOINT) {
    throw new ConfigurationError('RPC_SUI_ENDPOINT is not configured');
  }
  const endpoint = process.env.RPC_SUI_ENDPOINT;

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
            package: packageAddress
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

export function cleanEventType(eventType: string) {
  return eventType.substring(eventType.indexOf(':') + 2);
}
