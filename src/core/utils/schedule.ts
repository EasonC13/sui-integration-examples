import fetch from 'cross-fetch';
import { getSecretValue } from 'src/core/utils/secrets';
import { publishSlackMessage } from 'src/core/utils/slack';

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
    const slackChannel = await getSecretValue('API_ERRORS_SLACK_CHANNEL');
    log('Scheduled handler execution failed.', LogLevel.ERROR);
    log(error, LogLevel.ERROR);
    await publishSlackMessage(
      slackChannel,
      `*API error reported: Scheduled handler ${handlerFunc.name} execution failed.*\n\`\`\`${error.stack}\`\`\``
    );
  }
}
