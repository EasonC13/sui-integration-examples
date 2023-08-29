import { RawSigner } from '@mysten/sui.js';
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { ConfigurationError } from 'src/core/errors';
import { getSecretValue } from 'src/core/utils/secrets';
import {
  SuiSponsoredTransactionRequest,
  SuiSponsoredTransactionResponse,
} from 'src/models/sui-models';

export async function signSponsoredTransaction(
  request: SuiSponsoredTransactionRequest
): Promise<SuiSponsoredTransactionResponse> {
  if (!process.env.SUI_RPC_URL) {
    throw new ConfigurationError('SUI_RPC_URL is not configured');
  }
  if (!process.env.SUI_PACKAGE_ID) {
    throw new ConfigurationError('SUI_PACKAGE_ID is not configured');
  }
  if (!process.env.SUI_ACTION_MAX_BUDGET) {
    throw new ConfigurationError('SUI_ACTION_MAX_BUDGET is not configured');
  }
  const { SUI_RPC_URL } = process.env;
  const provider = new SuiClient({ url: SUI_RPC_URL });

  const sponsorAccountPrivateKey = await getSecretValue(
    'SUI_SPONSOR_PRIVATE_KEY'
  );
  const sponsorKeyBytes = Uint8Array.from(
    Buffer.from(sponsorAccountPrivateKey, 'hex')
  );
  const sponsorKeypair = Ed25519Keypair.fromSecretKey(sponsorKeyBytes);
  const sponsorSigner = new RawSigner(sponsorKeypair, provider);

  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${process.env.SUI_PACKAGE_ID}::${request.module}::${request.action}`,
    arguments: request.arguments.map((item: unknown) => tx.pure(item)),
  });

  tx.setSender(request.sender);
  tx.setGasOwner(await sponsorSigner.getAddress());
  tx.setGasBudget(Number(process.env.SUI_ACTION_MAX_BUDGET));

  const sponsorSignedTransaction = await sponsorSigner.signTransactionBlock({
    transactionBlock: tx,
  });

  return new SuiSponsoredTransactionResponse(
    sponsorSignedTransaction.transactionBlockBytes,
    sponsorSignedTransaction.signature
  );
}
