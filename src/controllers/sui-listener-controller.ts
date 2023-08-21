/* eslint-disable no-await-in-loop */
// import { PaginatedEvents } from '@mysten/sui.js';
import { SUI_LISTENER_SQS_QUEUE_NAME } from 'src/core/constants';
// import { SUI_LISTENER_SNS_TOPIC_NAME } from 'src/core/constants';
import { DynamoDBConnector } from 'src/core/db/DynamoDbConnector';
// import { Config } from 'src/core/db/entities/Config';
import { ConfigRepository, LISTENER_CURSOR } from 'src/core/db/repositories/ConfigRepository';
import { ConfigurationError } from 'src/core/errors';
import { queryEvents } from 'src/core/utils/sui';
// import { cleanEventType } from 'src/core/sui-blockchain/utils';
import { log } from 'src/core/utils/logger';
// import { pushToSNS } from 'src/core/utils/sns';
import { pushToSQS } from 'src/core/utils/sqs';
import {
  ReadSuiEventsRequestModel,
  ReadSuiEventsResponseModel,
} from 'src/models/sui-models';

const TRANSACTIONS_MAX_NUMBER = 100;

const connDynamoDB = new DynamoDBConnector(process.env);
const configRepository = new ConfigRepository(connDynamoDB);

export async function readSuiEvents(
  _readEventsRequest: ReadSuiEventsRequestModel
): Promise<ReadSuiEventsResponseModel> {
  if (!process.env.SUI_PACKAGE_ADDRESS) {
    throw new ConfigurationError('SUI_PACKAGE_ADDRESS is not configured');
  }
  const { SUI_PACKAGE_ADDRESS } = process.env;

  log('Reading cursors from db.');
  const cursorConfig = await configRepository.get(LISTENER_CURSOR);
  const cursor = cursorConfig && cursorConfig.value ? JSON.parse(cursorConfig.value) : undefined;

  log(
    `Requesting ${TRANSACTIONS_MAX_NUMBER} events for package ${SUI_PACKAGE_ADDRESS} with cursor ${cursorConfig?.value}`
  );
  const events = await queryEvents(SUI_PACKAGE_ADDRESS, cursor, TRANSACTIONS_MAX_NUMBER);

  log(`Number of recieved events: ${JSON.stringify(events)}`);

  log('Pushing new events to SQS and SNS.');

  for (let i = 0; i < events.length; i++) {
    await pushToSQS(SUI_LISTENER_SQS_QUEUE_NAME, events[i]);
    
    // Optional events can also be pushed to SNS for other components to react to the events
    // await pushToSNS(SUI_LISTENER_SNS_TOPIC_NAME, events[i]);
  }

  // const configPromises: Promise<any>[] = [];
  // const nextCursors = events.map((item) => item.nextCursor);

  // log('Updating cursors.');
  // nextCursors.forEach((newNextCursor, index) => {
  //   const cursorKey = suiModules[index]!;
  //   if (newNextCursor) {
  //     const cursorValue = JSON.stringify(newNextCursor);

  //     const cursorConfig = new Config({
  //       key: cursorKey,
  //       value: cursorValue,
  //     });

  //     log(
  //       `Updating next cursor for module ${cursorKey} in db - ${cursorValue}`
  //     );
  //     if (!moduleConfigs[index]) {
  //       configPromises.push(configRepository.put(cursorConfig));
  //     } else {
  //       configPromises.push(configRepository.update(cursorKey, cursorConfig));
  //     }
  //   } else {
  //     log(`No next cursor for module ${cursorKey}.`);
  //   }
  // });
  // await Promise.all(configPromises);

  return new ReadSuiEventsResponseModel();
}
