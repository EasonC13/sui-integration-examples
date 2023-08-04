import { WebClient, LogLevel } from '@slack/web-api';
import { getSecretValue } from 'src/core/utils/secrets';

import { log } from './logger';

export async function publishSlackMessage(
  id: string,
  message: string
): Promise<void> {
  log(`Send message to Slack channel: ${id}`);
  log(`Message: ${message}`);
  const accessToken = await getSecretValue('SLACK_OAUTH_TOKEN');

  const client = new WebClient(accessToken, {
    logLevel: LogLevel.DEBUG,
  });

  const result = await client.chat.postMessage({
    token: accessToken,
    channel: id,
    text: message,
  });

  if (result.ok && result.message) {
    log('Message was successfully sent!');
  } else {
    log("Message wasn't sent!");
  }
}
