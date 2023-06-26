import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { response } from "../utils";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env!.BUCKET_NAME as string;
const BUCKET_REGION = process.env!.PRODUCT_AWS_REGION as string;

export const handler = async (event: any) => {
  const name = event.queryStringParameters.name;
  const client = new S3Client({ region: BUCKET_REGION });
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `uploaded/${name}`
  });
  try {
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return response(200, url);
  } catch (error) {
    return response(500, { message: error });
  }
};
