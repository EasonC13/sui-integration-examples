import AWS, { DynamoDB } from 'aws-sdk';
import { AttributeMap, Key, TransactWriteItem } from 'aws-sdk/clients/dynamodb';

import { DynamoDBConnector } from '../DynamoDbConnector';

export function copyArray<InputT, OutputT>(
  source: InputT[],
  transform: (a: InputT) => OutputT
): OutputT[] {
  const dest = new Array<OutputT>(source.length);
  for (let i = 0; i < source.length; i++) {
    const sourceItem = source[i];
    if (sourceItem !== undefined) {
      dest[i] = transform(sourceItem);
    }
  }
  return dest;
}

export abstract class BaseDynamoDbRepository<EntityT, KeyT> {
  protected dynamoDB: DynamoDB;

  protected tableName: string;

  constructor(conn: DynamoDBConnector, baseTableName: string) {
    this.dynamoDB = conn.getDynamoDB();
    this.tableName = conn.getTableName(baseTableName);
  }

  public async get(key: KeyT): Promise<EntityT | null> {
    const keyItem = this.buildKey(key);
    const response = await this.dynamoDB
      .getItem({
        TableName: this.tableName,
        Key: keyItem,
      })
      .promise();
    if (!response.Item) {
      return null;
    }
    return this.fromAttributeMap(response.Item);
  }

  public async getItems(params: any = {}): Promise<EntityT[] | null> {
    const result: EntityT[] = [];
    const response = await this.dynamoDB
      .scan({
        ...params,
        TableName: this.tableName,
      })
      .promise();
    if (!response.Items) {
      return null;
    }
    response.Items.forEach((e) => result.push(this.fromAttributeMap(e)));
    return result;
  }

  public async getCount(params: any = {}): Promise<number> {
    const response = await this.dynamoDB
      .scan({
        ...params,
        TableName: this.tableName,
        Select: 'COUNT',
      })
      .promise();
    if (!response.Count) {
      return 0;
    }
    return response.Count;
  }

  public async hasKey(key: KeyT): Promise<boolean> {
    const keyItem = this.buildKey(key);
    const response = await this.dynamoDB
      .getItem({
        TableName: this.tableName,
        Key: keyItem,
      })
      .promise();

    return !!response.Item;
  }

  public async put(item: EntityT): Promise<EntityT> {
    const itemAttributeMap = this.toAttributeMap(item);
    await this.dynamoDB
      .putItem({
        Item: itemAttributeMap,
        TableName: this.tableName,
      })
      .promise();
    return item;
  }

  public async update(key: KeyT, item: EntityT): Promise<EntityT | null> {
    const keyItem = this.buildKey(key);
    const getResponse = await this.dynamoDB
      .getItem({
        TableName: this.tableName,
        Key: keyItem,
      })
      .promise();
    const old: any = getResponse.Item
      ? this.fromAttributeMap(getResponse.Item)
      : item;
    const newItem = this.toAttributeMap(item); // get AttributeMap to insert data into a query

    const updates: string[] = []; // list of pairs field = :value have been changed
    const values: { [id: string]: any } = {}; // values of fields have been changed (for ExpressionAttributeValues)
    const names: { [id: string]: any } = {}; // names of fields have been changed (for ExpressionAttributeValues)

    Object.keys(old).forEach((param) => {
      const p = param as keyof EntityT;
      if (old[p] !== item[p]) {
        const attr = `:${param.toString()}`; // key for ExpressionAttributeValues
        values[attr] = newItem[param];
        names[`#${param.toString()}`] = param.toString();
        updates.push(`#${param.toString()} = ${attr}`);
      }
    });

    if (Object.keys(values).length === 0 && Object.keys(names).length === 0) {
      return null;
    }

    const expression = `SET ${updates.join(', ')}`; // expression for update query

    await this.dynamoDB
      .updateItem({
        TableName: this.tableName,
        Key: keyItem,
        ...(Object.keys(values).length === 0 && Object.keys(names).length === 0
          ? {}
          : {
              UpdateExpression: expression,
              ExpressionAttributeValues: values,
              ExpressionAttributeNames: names,
            }),
      })
      .promise();
    return item;
  }

  public async updateFields(
    key: KeyT,
    fields: string[],
    values: any[]
  ): Promise<EntityT | undefined> {
    const preparedValues: { [id: string]: any } = {};
    values.forEach((e) => {
      preparedValues[`:${e}`] = AWS.DynamoDB.Converter.input(e);
    });
    const updateExpression = `SET ${fields
      .map((e) => `${e} = :${e}`)
      .join(', ')}`;
    const response = await this.dynamoDB
      .updateItem({
        TableName: this.tableName,
        Key: this.buildKey(key),
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: preparedValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise();
    return response.Attributes
      ? this.fromAttributeMap(response.Attributes)
      : response.Attributes;
  }

  public async delete(key: KeyT): Promise<KeyT> {
    const keyItem = this.buildKey(key);
    await this.dynamoDB
      .deleteItem({
        TableName: this.tableName,
        Key: keyItem,
      })
      .promise();
    return key;
  }

  public createPutQuery(item: EntityT): TransactWriteItem {
    const itemAttributeMap = this.toAttributeMap(item);
    return {
      Put: {
        Item: itemAttributeMap,
        TableName: this.tableName,
      },
    };
  }

  public createDeleteQuery(key: KeyT): TransactWriteItem {
    const keyItem = this.buildKey(key);
    return {
      Delete: {
        Key: keyItem,
        TableName: this.tableName,
      },
    };
  }

  public getTableName() {
    return this.tableName;
  }

  protected abstract toAttributeMap(item: EntityT): AttributeMap;

  protected abstract fromAttributeMap(itemAttributeMap: AttributeMap): EntityT;

  protected abstract buildKey(key: KeyT): Key;
}
