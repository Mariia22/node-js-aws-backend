import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import csvParser = require("csv-parser");
import { Readable } from "stream";
let AWS = require("aws-sdk");

export const handler = async (event: any) => {
  try {
    const client = new S3Client({ region: process.env!.PRODUCT_AWS_REGION });
    const record = event.Records[0];
    const name = record.s3.bucket.name;
    const recordKey = record.s3.object.key;
    const sqs = new AWS.SQS();

    const command = new GetObjectCommand({
      Bucket: name,
      Key: recordKey
    });
    const response = await client.send(command);
    const body = response.Body as Readable;
    body
      .pipe(csvParser())
      .on("data", (chunk) => {
        let params = {
          MessageBody: JSON.stringify(chunk),
          QueueUrl: process.env!.IMPORT_SQS
        };
        sqs.sendMessage(params, function (err: any, chunk: any) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", `${JSON.stringify(chunk)} is downloaded`);
          }
        });
      })
      .on("end", () => {
        console.log("RESULT");
      })
      .on("error", (error) => {
        console.log("Error during the parsing file" + error);
      });

    await replaceFile(recordKey, client);
  } catch (error: any) {
    console.log(error.message);
  }
};

async function replaceFile(key: string, client: S3Client) {
  const copyFile = new CopyObjectCommand({
    Bucket: process.env!.BUCKET_NAME,
    CopySource: `/${process.env!.BUCKET_NAME}/${key}`,
    Key: key.replace("uploaded", "parsed")
  });

  await client.send(copyFile);

  const deleteFile = new DeleteObjectCommand({
    Bucket: process.env!.BUCKET_NAME,
    Key: key
  });

  await client.send(deleteFile);
  console.log("File is replaced successfully");
}
