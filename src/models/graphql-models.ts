import { BadRequestError } from 'src/core/errors';

export class ExecuteQueryRequest {
  public network: string;

  public query: string;

  public variables: any;

  constructor(req: any) {
    this.variables = req.body.variables;
    if (req.params.network) {
      this.network = req.params.network;
    } else {
      throw new BadRequestError('Network is missing in the request');
    }
    if (req.body.query) {
      this.query = req.body.query;
    } else {
      throw new BadRequestError('Query is missing in the request');
    }
  }
}

export class ExecuteQueryResponse {
  public data: any;

  public errors: any;

  constructor(response: any) {
    this.data = response.data;
    this.errors = response.errors;
  }
}
