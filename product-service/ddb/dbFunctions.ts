import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { defaultTableName } from "../utils";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const scan = async (tableName: string | undefined) => {
  let name = tableName ?? defaultTableName;
  let result = await db.send(new ScanCommand({ TableName: name }));
  return result.Items;
};
