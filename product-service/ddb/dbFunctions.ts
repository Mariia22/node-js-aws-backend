import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";
import { RequestBody } from "../types";
const AWS = require("aws-sdk");

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

export const createPost = async (
  requestJSON: RequestBody,
  tableProducts: string,
  tableStocks: string
) => {
  const postId = AWS.util.uuid.v4();
  await db.send(
    new PutCommand({
      TableName: tableProducts,
      Item: {
        id: postId,
        description: requestJSON.description,
        title: requestJSON.title,
        price: requestJSON.price
      }
    })
  );
  await db.send(
    new PutCommand({
      TableName: tableStocks,
      Item: {
        product_id: postId,
        count: requestJSON.count
      }
    })
  );
  return `Create item ${requestJSON.title}`;
};
