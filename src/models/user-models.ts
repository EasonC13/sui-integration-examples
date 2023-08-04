import { BadRequestError } from 'src/core/errors';

export class UserRegisterRequest {
  public token: string;

  constructor(req: any) {
    const token = req.headers.authorization ?? req.headers.Authorization;
    if (!token) {
      throw new BadRequestError(
        'Authorization token is missing in the request header'
      );
    }
    this.token = token;
  }
}

export class UserRegisterResponse {
  public success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}
