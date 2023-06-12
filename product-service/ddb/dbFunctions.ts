import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand
} from "@aws-sdk/lib-dynamodb";
import { defaultTableName } from "../utils";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const scan = async (tableName: string | undefined) => {
  let name = tableName ?? defaultTableName;
  let result = await db.send(new ScanCommand({ TableName: name }));
  return result.Items;
};

export const getItemById = async (
  tableName: string | undefined,
  id: string
) => {
  let name = tableName ?? defaultTableName;
  let result = await db.send(
    new GetCommand({
      TableName: name,
      Key: {
        id
      }
    })
  );
  return result.Item;
};
