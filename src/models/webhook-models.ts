import { BadRequestError } from 'src/core/errors';

export class WebhookRequest {
  public id?: string;

  public network: string;

  public packageId: string;

  public secretToken: string;

  public state: string;

  constructor(req: any) {
    const { body } = req;

    this.network = body.network;
    this.packageId = body.packageId;
    this.secretToken = body.secretToken;
    this.state = body.state;
  }
}

export class WebhookStateRequest {
  public id: string;

  public state: string;

  constructor(req: any) {
    const { params } = req;

    if (params.id) {
      this.id = params.id;
    } else {
      throw new BadRequestError('WebhookId is missing in the request');
    }
    this.id = params.id;
    this.state = params.state;
  }
}

export class WebhookResponse {
  public success: boolean;

  public id?: string;

  constructor(success: boolean, id?: string) {
    this.success = success;
    this.id = id;
  }
}
