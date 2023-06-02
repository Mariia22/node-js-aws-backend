import * as lambda from "aws-cdk-lib/aws-lambda";

export const response = (code: number, body: Record<string, any>) => ({
  statusCode: code,
  headers: {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  },
  body: JSON.stringify(body)
});

// Define common lambda props
export const shareLambdaProps = {
  runtime: lambda.Runtime.NODEJS_18_X,
  enviroment: {
    PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION
  }
};
