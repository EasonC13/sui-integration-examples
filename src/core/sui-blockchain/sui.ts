import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import { ConfigurationError } from 'src/core/errors';
import { getSecretValue } from 'src/core/utils/secrets';

export async function createSuiProvider() {
  const endpoint = await getSecretValue('RPC_SUI_ENDPOINT');
  if (!endpoint) {
    throw new ConfigurationError('SUI_RPC_ENDPOINT is not configured');
  }

  const connection = new Connection({ fullnode: endpoint });

  return new JsonRpcProvider(connection);
}

export async function queryEvents(
  packageAddress: string,
  moduleLib: string,
  cursor: string | undefined | null,
  maxTxNumber: number
) {
  const endpoint = await getSecretValue('RPC_SUI_ENDPOINT');
  if (!endpoint) {
    throw new ConfigurationError('SUI_RPC_ENDPOINT is not configured');
  }

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

export async function getObject(objectId: string) {
  const endpoint = await getSecretValue('RPC_SUI_ENDPOINT');
  if (!endpoint) {
    throw new ConfigurationError('SUI_RPC_ENDPOINT is not configured');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'sui_getObject',
      params: [
        objectId,
        {
          showType: false,
          showOwner: false,
          showPreviousTransaction: false,
          showDisplay: false,
          showContent: true,
          showBcs: false,
          showStorageRebate: false,
        },
      ],
    }),
  });

  const responseObject = await response.json();

  return responseObject.result;
}

export async function getDynamicFieldObject(
  objectId: string,
  type: string,
  index: string
) {
  const endpoint = await getSecretValue('RPC_SUI_ENDPOINT');
  if (!endpoint) {
    throw new ConfigurationError('SUI_RPC_ENDPOINT is not configured');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'suix_getDynamicFieldObject',
      params: [
        objectId,
        {
          type,
          value: index,
        },
        {
          showType: false,
          showOwner: false,
          showPreviousTransaction: false,
          showDisplay: false,
          showContent: true,
          showBcs: false,
          showStorageRebate: false,
        },
      ],
    }),
  });

  const responseObject = await response.json();

  return responseObject.result;
}
