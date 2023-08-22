import AWS from 'aws-sdk';
import { TransactWriteItemList } from 'aws-sdk/clients/dynamodb';

export class DynamoDBConnector {
  private dynamoDB: AWS.DynamoDB;

  constructor(env: any) {
    const { DYNAMODB_ENDPOINT, REGION } = env;
    const options: AWS.DynamoDB.Types.ClientConfiguration = {
      region: REGION,
      endpoint: DYNAMODB_ENDPOINT,
    };
    this.dynamoDB = new AWS.DynamoDB(options);
  }

  public getDynamoDB(): AWS.DynamoDB {
    return this.dynamoDB;
  }

  public getTableName(baseName: string): string {
    return `${process.env.ENV}-${baseName}`;
  }

  public async executeWriteTransaction(
    queryList: TransactWriteItemList
  ): Promise<boolean> {
    const data = await this.dynamoDB
      .transactWriteItems({
        TransactItems: queryList,
      })
      .promise(); // Throws AWS error it will captured within global error handler
    if (data == null) {
      return false;
    }
    return true;
  }
}
