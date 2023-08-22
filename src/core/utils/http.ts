import fetch from 'cross-fetch';

import { log, LogLevel } from './logger';
import {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  BadRequestErrorWithBody,
} from '../errors';

global.fetch = fetch;

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum StatusCodes {
  OK = 200,
  AUTH_ERR = 401,
  FORBIDDEN_ERR = 403,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_ERR = 500,
}

enum ResponseTypeHeaders {
  HTML = 'text/html; charset=utf-8',
  XML = 'text/xml; charset=utf-8',
  JSON = 'application/json',
}

export enum ResponseType {
  HTML,
  XML,
  JSON,
  Redirect,
}

type HttpRequest = {
  query: any;
  body: any;
  params: any;
  headers: any;
  rawBody: any;
};

type HttpReponse = {
  statusCode: number;
  body: string;
  headers: { [key: string]: any };
};

export function getHttpRequest(event: any): HttpRequest {
  let query = {};
  let body = {};
  let params = {};
  let headers = {};
  let rawBody = {};

  const { method } = event.requestContext.http;

  if (method !== Methods.GET && event.body) {
    const contentType =
      event.headers['content-type'] || event.headers['Content-Type'];

    switch (contentType) {
      case 'application/x-www-form-urlencoded':
        body = new URLSearchParams(
          event.isBase64Encoded
            ? Buffer.from(event.body, 'base64').toString('binary')
            : event.body
        );
        break;
      case 'application/json':
        body = JSON.parse(event.body);
        break;
      default:
        break;
    }

    rawBody = event.body;
  }

  if (event.queryStringParameters) {
    query = event.queryStringParameters;
  }
  if (event.pathParameters) {
    params = event.pathParameters;
  }

  if (event.headers) {
    headers = event.headers;
  }

  return {
    query,
    body,
    params,
    headers,
    rawBody,
  };
}

export function getHttpResponse(
  statusCode: StatusCodes,
  responseObj: any,
  responseType: ResponseType = ResponseType.JSON
): HttpReponse {
  if (responseType === ResponseType.Redirect) {
    return {
      statusCode: 302,
      body: '',
      headers: {
        Location: responseObj,
      },
    };
  }

  return {
    statusCode,
    body:
      responseType === ResponseType.JSON
        ? JSON.stringify(responseObj)
        : responseObj,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Content-Type': (() => {
        if (responseType === ResponseType.HTML) return ResponseTypeHeaders.HTML;
        if (responseType === ResponseType.XML) return ResponseTypeHeaders.XML;
        return ResponseTypeHeaders.JSON;
      })(),
    },
  };
}

async function baseHandleRequest(
  RequestModelType: new (req: any) => any,
  handlerFunc: (params: any) => any,
  event: any,
  responseType: ResponseType = ResponseType.JSON
): Promise<any> {
  try {
    const req = getHttpRequest(event);
    let requestModel = {};
    try {
      requestModel = new RequestModelType(req);
    } catch (error) {
      log(error, LogLevel.ERROR);
      throw new BadRequestError('Error while building request model');
    }
    const responseModel = await handlerFunc(requestModel);

    return getHttpResponse(StatusCodes.OK, responseModel, responseType);
  } catch (error: any) {
    log(error, LogLevel.ERROR);

    if (error instanceof NotFoundError) {
      return getHttpResponse(StatusCodes.NOT_FOUND, 'Not found');
    }
    if (error instanceof BadRequestError) {
      return getHttpResponse(StatusCodes.BAD_REQUEST, error.message);
    }
    if (error instanceof BadRequestErrorWithBody) {
      return getHttpResponse(
        StatusCodes.BAD_REQUEST,
        error as BadRequestErrorWithBody
      );
    }
    if (error instanceof UnauthorizedError) {
      return getHttpResponse(StatusCodes.AUTH_ERR, error.message);
    }
    if (error instanceof ForbiddenError) {
      return getHttpResponse(StatusCodes.FORBIDDEN_ERR, error.message);
    }
    return getHttpResponse(StatusCodes.INTERNAL_ERR, 'Error occurred');
  }
}

export async function handleRequest(
  RequestModelType: new (req: any) => any,
  handlerFunc: (params: any) => any,
  event: any,
  responseType: ResponseType = ResponseType.JSON
): Promise<any> {
  return baseHandleRequest(RequestModelType, handlerFunc, event, responseType);
}
