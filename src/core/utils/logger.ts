import logEventToCloudWatch from './cloud-watch-logs';

export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
}

export const log = (obj: any, _level: LogLevel = LogLevel.INFO): void => {
  console.log(obj);
};

export const getRequestProperties = (event: any) => {
  return {
    message: `Request received: ${event.requestContext.http.method} ${event.rawPath}`,
    env: process.env.ENV,
    timestamp: new Date().getTime(),
    requestHeaders: event.headers,
    requestBody: event.body,
    userAgent: event.requestContext.http.userAgent,
    requestId: event.requestContext.requestId,
  };
};

export const logToCloudWatch = (event: any): void => {
  const logEvent = {
    ...getRequestProperties(event),
  };
  logEventToCloudWatch(logEvent);
};

export const logErrorToCloudWatch = (event: any, error: any): void => {
  const logEvent = {
    ...getRequestProperties(event),
    error,
  };
  logEventToCloudWatch(logEvent);
};
