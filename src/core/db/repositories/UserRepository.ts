import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { parseNullableInt } from 'src/core/utils/parser';

import { BaseDynamoDbRepository } from './BaseDynamoDbRepository';
import { DynamoDBConnector } from '../DynamoDbConnector';
import { User } from '../entities/User';

export const BASE_TABLE_NAME_USER = 'suiql-user';

export class UserRepository extends BaseDynamoDbRepository<User, string> {
  constructor(conn: DynamoDBConnector) {
    super(conn, BASE_TABLE_NAME_USER);
  }

  protected toAttributeMap(item: User): AttributeMap {
    return {
      login: { S: item.login },
      id: { N: item.id?.toString() },
      avatar_url: { S: item.avatar_url },
    };
  }

  protected fromAttributeMap(itemAttributeMap: AttributeMap): User {
    if (!itemAttributeMap) {
      throw Error('Unexpected undefined itemAttributeMap');
    }

    return new User({
      login: itemAttributeMap.login?.S,
      id: parseNullableInt(itemAttributeMap.id?.N),
      avatar_url: itemAttributeMap.avatar_url?.S,
    });
  }

  protected buildKey(login: string): any {
    return {
      login: {
        S: login,
      },
    };
  }
}
