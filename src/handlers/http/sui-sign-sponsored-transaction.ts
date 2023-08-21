import { handleRequest } from 'src/core/utils/http';
import { signSponsoredTransaction } from 'src/controllers/sui-transactions-controller';
import { SuiSponsoredTransactionRequest } from 'src/models/sui-models';

export const handler = async (event: any) =>
  handleRequest(
    SuiSponsoredTransactionRequest,
    signSponsoredTransaction,
    event
  );
