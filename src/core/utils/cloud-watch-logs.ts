import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
  ResourceAlreadyExistsException,
} from '@aws-sdk/client-cloudwatch-logs';

const client = new CloudWatchLogsClient({ region: process.env.REGION });

const logGroupName = `suiql-api-logs-${process.env.ENV}`;
const logStreamName = 'post-graphql-logs';

async function createLogGroupAndStream() {
  try {
    const createLogGroupParams = { logGroupName };
    await client.send(new CreateLogGroupCommand(createLogGroupParams));

    const command = new CreateLogStreamCommand({
      logGroupName,
      logStreamName,
    });
    await client.send(command);

    console.log(`Log stream ${logStreamName} created for ${logGroupName}.`);
  } catch (error: any) {
    if (!(error instanceof ResourceAlreadyExistsException)) {
      console.log(error, error.stack);
    }
  }
}

if (process.env.ENV !== 'offline') {
  createLogGroupAndStream(); // TODO move to a place where its called once when app starts
}

export default async function logEventToCloudWatch(logEvent: any) {
  if (process.env.ENV !== 'offline') {
    const request = new PutLogEventsCommand({
      logGroupName,
      logStreamName,
      logEvents: [
        {
          message: JSON.stringify(logEvent),
          timestamp: logEvent.timestamp,
        },
      ],
    });

    client
      .send(request)
      .then((_) => {
        // console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
