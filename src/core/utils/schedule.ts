import fetch from 'cross-fetch';
import { log, LogLevel } from './logger';

global.fetch = fetch;

export async function handleScheduleRequest(
  requestParams: any,
  handlerFunc: (params: any) => any
) {
  try {
    const result = await handlerFunc(requestParams);
    log(
      `Handling of Scheduled event completed with result ${JSON.stringify(
        result
      )}`,
      LogLevel.INFO
    );
  } catch (error: any) {
    log('Scheduled handler execution failed.', LogLevel.ERROR);
    log(error, LogLevel.ERROR);
  }
}
