import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const tableList = {
  0: "Products",
  1: "Stocks"
};

export const scan = async (tableName: string) => {
  let result = await db.send(new ScanCommand({ TableName: tableName }));
  return result.Items;
};

export const getItemById = async (tableName: string, id: string) => {
  let result = await db.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        id
      }
    })
  );
  return result.Item;
};
