/* eslint-disable no-await-in-loop */
import { PaginatedEvents } from '@mysten/sui.js';
import { SUI_LISTENER_SQS_QUEUE_NAME, suiModules } from 'src/core/constants';
import { DynamoDBConnector } from 'src/core/db/DynamoDbConnector';
import { Config } from 'src/core/db/entities/Config';
import { ConfigRepository } from 'src/core/db/repositories/ConfigRepository';
import { ConfigurationError } from 'src/core/errors';
import { log } from 'src/core/utils/logger';
import { pushToSQS } from 'src/core/utils/sqs';
import { queryEvents } from 'src/core/utils/sui';
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
  const moduleConfigPromises: Promise<Config | null>[] = [];
  suiModules.forEach((module) =>
    moduleConfigPromises.push(configRepository.get(module))
  );
  const moduleConfigs = await Promise.all(moduleConfigPromises);

  const eventsPromises: Promise<PaginatedEvents>[] = [];

  suiModules.forEach((module, index) => {
    const cursorConfig = moduleConfigs[index];
    const cursor = cursorConfig ? JSON.parse(cursorConfig.value!) : undefined;

    log(
      `Requesting ${TRANSACTIONS_MAX_NUMBER} events for module ${module} with cursor ${cursorConfig?.value}`
    );

    eventsPromises.push(
      queryEvents(SUI_PACKAGE_ADDRESS, module, cursor, TRANSACTIONS_MAX_NUMBER)
    );
  });

  const events = await Promise.all(eventsPromises);

  const eventObjects: any[] = [];
  events.forEach((event) => eventObjects.push(...event.data));
  log(`Number of recieved events: ${eventObjects.length}`);

  log('Pushing new events to SQS.');
  for (let i = 0; i < eventObjects.length; i++) {
    await pushToSQS(SUI_LISTENER_SQS_QUEUE_NAME, eventObjects[i]);
  }

  const configPromises: Promise<any>[] = [];
  const nextCursors = events.map((item) => item.nextCursor);

  log('Updating cursors.');
  nextCursors.forEach((newNextCursor, index) => {
    const cursorKey = suiModules[index]!;
    if (newNextCursor) {
      const cursorValue = JSON.stringify(newNextCursor);

      const cursorConfig = new Config({
        key: cursorKey,
        value: cursorValue,
      });

      log(
        `Updating next cursor for module ${cursorKey} in db - ${cursorValue}`
      );
      if (!moduleConfigs[index]) {
        configPromises.push(configRepository.put(cursorConfig));
      } else {
        configPromises.push(configRepository.update(cursorKey, cursorConfig));
      }
    } else {
      log(`No next cursor for module ${cursorKey}.`);
    }
  });
  await Promise.all(configPromises);

  return new ReadSuiEventsResponseModel();
}
