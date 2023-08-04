import { BadRequestError } from 'src/core/errors';

export class ReadSuiEventsRequestModel {}

export class ReadSuiEventsResponseModel {}

export class SuiSponsoredTransactionRequest {
  public module: string;

  public action: string;

  public sender: string;

  public arguments: any[];

  constructor(req: any) {
    if (req.body.module) {
      this.module = req.body.module;
    } else {
      throw new BadRequestError('Module is missing in the request');
    }

    if (req.body.action) {
      this.action = req.body.action;
    } else {
      throw new BadRequestError('Action is missing in the request');
    }

    if (req.body.sender) {
      this.sender = req.body.sender;
    } else {
      throw new BadRequestError('Sender is missing in the request');
    }

    if (req.body.arguments) {
      this.arguments = req.body.arguments;
    } else {
      throw new BadRequestError('Sender is missing in the request');
    }
  }
}

export class SuiSponsoredTransactionResponse {
  public transactionBlockBytes: string;

  public signatureBytes: string;

  constructor(transactionBlockBytes: string, signatureBytes: string) {
    this.transactionBlockBytes = transactionBlockBytes;
    this.signatureBytes = signatureBytes;
  }
}
