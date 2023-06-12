import * as lambda from "aws-cdk-lib/aws-lambda";

export const response = (code: number, body: any) => ({
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

export const joinArrays = (
  array1: Record<string, any>[],
  array2: Record<string, any>[]
): Record<string, any>[] => {
  const result = array1.map((data) => {
    const count = array2.find((item) => item.product_id === data.id)?.count;
    return { ...data, count };
  });
  return result;
};
