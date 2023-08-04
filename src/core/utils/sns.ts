import fetch from 'cross-fetch';
import { getSecretValue } from 'src/core/utils/secrets';
import { publishSlackMessage } from 'src/core/utils/slack';

import { log, LogLevel } from './logger';

const AWS = require('aws-sdk');

global.fetch = fetch;

export const SNS = new AWS.SNS({
  endpoint: process.env.SNS_ENDPOINT,
  region: process.env.REGION,
});

export async function pushToSNS(topic: any, content: any) {
  const topicArn = `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_ID}:${topic}-${process.env.ENV}`;
  log(`Topic ARN is ${topicArn}`);

  try {
    const message = JSON.stringify(content);
    const result = await SNS.publish({
      Message: message,
      TopicArn: topicArn,
    }).promise();
    log(
      `Successfully published event to SNS. Topic: ${topicArn}. Message: ${message}. Result: ${JSON.stringify(
        result
      )}`,
      LogLevel.DEBUG
    );
    return result;
  } catch (err: any) {
    log(`Unable to publish event to SNS. Error: ${err}`);
    throw err;
  }
}

export async function handleSnsEvent<TRequestModelType>(
  handlerFunc: (params: any) => any,
  event: any
) {
  try {
    const requestModel = JSON.parse(
      event.Records[0].Sns.Message
    ) as TRequestModelType;
    const result = await handlerFunc(requestModel);
    log(
      `Handling of SNS event completed with result ${JSON.stringify(result)}`,
      LogLevel.INFO
    );
  } catch (error: any) {
    const slackChannel = await getSecretValue('API_ERRORS_SLACK_CHANNEL');
    log('SNS handler execution failed.', LogLevel.ERROR);
    log(error, LogLevel.ERROR);
    await publishSlackMessage(
      slackChannel,
      `*API error reported: SNS handler ${handlerFunc.name} execution failed.*\n\`\`\`${error.stack}\`\`\``
    );
  }
}
