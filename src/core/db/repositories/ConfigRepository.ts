import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { DynamoDBConnector } from 'src/core/db/DynamoDbConnector';
import { Config } from 'src/core/db/entities/Config';
import { BaseDynamoDbRepository } from 'src/core/db/repositories/BaseDynamoDbRepository';

const BASE_TABLE_NAME_CONFIG = 'sui-listener-config';

export const LISTENER_CURSOR = 'listenerCursor';

export class ConfigRepository extends BaseDynamoDbRepository<Config, string> {
  constructor(conn: DynamoDBConnector) {
    super(conn, BASE_TABLE_NAME_CONFIG);
  }

  protected toAttributeMap(item: Config): AttributeMap {
    return {
      key: { S: item.key },
      value: { S: item.value },
    };
  }

  protected fromAttributeMap(itemAttributeMap: AttributeMap): Config {
    if (!itemAttributeMap) {
      throw Error('Unexpected undefined itemAttributeMap');
    }

    return new Config({
      key: itemAttributeMap?.key?.S,
      value: itemAttributeMap?.value?.S,
    });
  }

  protected buildKey(key: string): any {
    return {
      key: {
        S: key,
      },
    };
  }
}
