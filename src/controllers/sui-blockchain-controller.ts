/* eslint-disable no-await-in-loop */
import { PaginatedEvents } from '@mysten/sui.js';
import {
  SUI_EVENTS_MAPPING_SNS_TOPIC_NAME,
  SUI_INDEXING_QUEUE,
} from 'src/core/constants';
import { DynamoDBConnector } from 'src/core/db/DynamoDbConnector';
import { Config } from 'src/core/db/entities/Config';
import { ConfigRepository } from 'src/core/db/repositories/ConfigRepository';
import { ConfigurationError } from 'src/core/errors';
import {
  USER_CREATED_SUI_EVENT_NAME,
  COMMUNITY_CREATED_SUI_EVENT_NAME,
  COMMUNITY_UPDATED_SUI_EVENT_NAME,
  TAG_CREATED_SUI_EVENT_NAME,
  TAG_UPDATED_SUI_EVENT_NAME,
  USER_UPDATED_SUI_EVENT_NAME,
  POST_CREATED_SUI_EVENT_NAME,
  REPLY_CREATED_SUI_EVENT_NAME,
  POST_EDITED_SUI_EVENT_NAME,
  POST_DELETED_SUI_EVENT_NAME,
  REPLY_DELETED_SUI_EVENT_NAME,
  REPLY_EDITED_SUI_EVENT_NAME,
  REPLY_MARKED_THE_BEST_SUI_EVENT_NAME,
  COMMENT_CREATED_SUI_EVENT_NAME,
  COMMENT_EDITED_SUI_EVENT_NAME,
  COMMENT_DELETED_SUI_EVENT_NAME,
  ITEM_VOTED_SUI_EVENT_NAME,
  FOLLOWED_COMMUNITY_SUI_EVENT_NAME,
  UNFOLLOWED_COMMUNITY_SUI_EVENT_NAME,
  ROLE_GRANTED_SUI_EVENT_NAME,
  ROLE_REVOKED_SUI_EVENT_NAME,
  MODERATOR_POST_EDITED_SUI_EVENT_NAME,
  MODERATOR_REPLY_EDITED_SUI_EVENT_NAME,
  SET_DOCUMENTATION_TREE_SUI_EVENT_NAME,
  suiModules,
} from 'src/core/sui-blockchain/constants';
import { queryEvents } from 'src/core/sui-blockchain/sui';
import { cleanEventType } from 'src/core/sui-blockchain/utils';
import { log } from 'src/core/utils/logger';
import { pushToSNS } from 'src/core/utils/sns';
import { pushToSQS } from 'src/core/utils/sqs';
import { Network } from 'src/models/event-models';
import {
  Event,
  BaseSuiEventModel,
  CommunityCreatedSuiEventModel,
  CommunityUpdatedSuiEventModel,
  PostCreatedSuiEventModel,
  TagCreatedSuiEventModel,
  TagUpdatedSuiEventModel,
  UserCreatedSuiEventModel,
  UserUpdatedSuiEventModel,
  ReplyCreatedSuiEventModel,
  PostEditedSuiEventModel,
  PostDeletedSuiEventModel,
  ReplyEditedSuiEventModel,
  ReplyDeletedSuiEventModel,
  ReplyMarkedTheBestSuiEventModel,
  ItemVotedSuiEventModel,
  FollowedCommunitySuiEventModel,
  UnfollowedCommunitySuiEventModel,
  CommentCreatedSuiEventModel,
  CommentEditedSuiEventModel,
  CommentDeletedSuiEventModel,
  RoleGrantedSuiEventModel,
  RoleRevokedSuiEventModel,
  SetDocumentationTreeSuiEventModel,
  SuiExportEventModel,
} from 'src/models/sui-event-models';
import {
  ReadSuiEventsRequestModel,
  ReadSuiEventsResponseModel,
} from 'src/models/sui-models';

const TRANSACTIONS_MAX_NUMBER = 100;

const eventToModelType: Record<string, typeof BaseSuiEventModel> = {};
eventToModelType[USER_CREATED_SUI_EVENT_NAME] = UserCreatedSuiEventModel;
eventToModelType[USER_UPDATED_SUI_EVENT_NAME] = UserUpdatedSuiEventModel;
eventToModelType[COMMUNITY_CREATED_SUI_EVENT_NAME] =
  CommunityCreatedSuiEventModel;
eventToModelType[COMMUNITY_UPDATED_SUI_EVENT_NAME] =
  CommunityUpdatedSuiEventModel;
eventToModelType[TAG_CREATED_SUI_EVENT_NAME] = TagCreatedSuiEventModel;
eventToModelType[TAG_UPDATED_SUI_EVENT_NAME] = TagUpdatedSuiEventModel;
eventToModelType[POST_CREATED_SUI_EVENT_NAME] = PostCreatedSuiEventModel;
eventToModelType[POST_EDITED_SUI_EVENT_NAME] = PostEditedSuiEventModel;
eventToModelType[MODERATOR_POST_EDITED_SUI_EVENT_NAME] =
  PostEditedSuiEventModel;
eventToModelType[POST_DELETED_SUI_EVENT_NAME] = PostDeletedSuiEventModel;
eventToModelType[REPLY_CREATED_SUI_EVENT_NAME] = ReplyCreatedSuiEventModel;
eventToModelType[REPLY_EDITED_SUI_EVENT_NAME] = ReplyEditedSuiEventModel;
eventToModelType[MODERATOR_REPLY_EDITED_SUI_EVENT_NAME] =
  ReplyEditedSuiEventModel;
eventToModelType[REPLY_DELETED_SUI_EVENT_NAME] = ReplyDeletedSuiEventModel;
eventToModelType[REPLY_MARKED_THE_BEST_SUI_EVENT_NAME] =
  ReplyMarkedTheBestSuiEventModel;
eventToModelType[ITEM_VOTED_SUI_EVENT_NAME] = ItemVotedSuiEventModel;
eventToModelType[FOLLOWED_COMMUNITY_SUI_EVENT_NAME] =
  FollowedCommunitySuiEventModel;
eventToModelType[UNFOLLOWED_COMMUNITY_SUI_EVENT_NAME] =
  UnfollowedCommunitySuiEventModel;
eventToModelType[SET_DOCUMENTATION_TREE_SUI_EVENT_NAME] =
  SetDocumentationTreeSuiEventModel;
eventToModelType[COMMENT_CREATED_SUI_EVENT_NAME] = CommentCreatedSuiEventModel;
eventToModelType[COMMENT_EDITED_SUI_EVENT_NAME] = CommentEditedSuiEventModel;
eventToModelType[COMMENT_DELETED_SUI_EVENT_NAME] = CommentDeletedSuiEventModel;

eventToModelType[ROLE_GRANTED_SUI_EVENT_NAME] = RoleGrantedSuiEventModel;
eventToModelType[ROLE_REVOKED_SUI_EVENT_NAME] = RoleRevokedSuiEventModel;

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

  log('Reading new events.');
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

  const eventObjects: Event[] = [];

  events
    .map((item) => item.data)
    .forEach((evs) => {
      evs.forEach((ev) => {
        eventObjects.push({
          ...ev,
          network: Network.Sui,
        });
      });
    });

  log(`Number of recieved events: ${eventObjects.length}`);

  const eventModels: BaseSuiEventModel[] = [];
  const exportEventModels: SuiExportEventModel[] = [];

  log('Pushing new events to SQS.');
  eventObjects
    .filter((event) => eventToModelType[cleanEventType(event.type)])
    .sort((a, b) => {
      if (a.timestampMs! < b.timestampMs!) return -1;
      if (a.timestampMs! > b.timestampMs!) return 1;
      return 0;
    })
    .forEach((event) => {
      const eventName = cleanEventType(event.type);
      const EventModeType = eventToModelType[eventName];
      if (!EventModeType) {
        throw new ConfigurationError(
          `Model type is not configured for event by name ${eventName}`
        );
      }
      const eventModel = new EventModeType(event);
      eventModels.push(eventModel);
      exportEventModels.push({
        ...event,
        name: eventName,
      });
    });

  for (let i = 0; i < eventModels.length; i++) {
    await pushToSQS(SUI_INDEXING_QUEUE, eventModels[i]);
    await pushToSNS(SUI_EVENTS_MAPPING_SNS_TOPIC_NAME, exportEventModels[i]);
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
