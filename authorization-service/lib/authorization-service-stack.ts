import { Stack, StackProps } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { shareLambdaProps } from "../utils";
import path = require("path");

export class AuthorizationServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const getProductsById = new NodejsFunction(this, "basicAuthorizer", {
      ...shareLambdaProps,
      functionName: "basicAuthorizer",
      entry: path.join(__dirname, "..", "lambda", "basicAuthorizer.ts")
    });
  }
}
