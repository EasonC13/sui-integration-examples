export class NotFoundError extends Error {}

export class BadRequestError extends Error {}

export class ConfigurationError extends Error {}

export class UnauthorizedError extends Error {}

export class ForbiddenError extends Error {}

export class BadRequestErrorWithBody extends Error {
  public message: string;

  public code: number;

  constructor(serviceErrorProps: { message: string; code: number }) {
    super();
    this.message = serviceErrorProps.message;
    this.code = serviceErrorProps.code;
  }
}

export class RuntimeError extends Error {}
