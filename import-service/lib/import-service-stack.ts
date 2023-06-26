import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { shareLambdaProps } from "./../../product-service/utils/index";
import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";
import * as apigwv from "@aws-cdk/aws-apigatewayv2-alpha";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3notifications from "aws-cdk-lib/aws-s3-notifications";
require("dotenv").config();

const BUCKET_NAME = process.env.BUCKET_NAME as string;

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const importProducts = new NodejsFunction(this, "importProductsFile", {
      ...shareLambdaProps,
      functionName: "importProductsFile",
      entry: path.join(__dirname, "..", "lambda", "importProductsFile.ts"),
      environment: {
        BUCKET_NAME
      }
    });

    const s3AccessPolicy = new iam.PolicyStatement({
      actions: ["s3:GetObject", "s3:PutObject"],
      resources: [`arn:aws:s3:::${BUCKET_NAME}/uploaded/*`]
    });
    importProducts.addToRolePolicy(s3AccessPolicy);

    const parseProducts = new NodejsFunction(this, "parseProductsFile", {
      ...shareLambdaProps,
      functionName: "parseProductsFile",
      entry: path.join(__dirname, "..", "lambda", "parseProductsFile.ts"),
      environment: {
        BUCKET_NAME
      }
    });

    const parsers3AccessPolicy = new iam.PolicyStatement({
      actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      resources: [
        `arn:aws:s3:::${BUCKET_NAME}/uploaded/*`,
        `arn:aws:s3:::${BUCKET_NAME}/parsed/*`
      ]
    });
    parseProducts.addToRolePolicy(parsers3AccessPolicy);

    const httpApi = new apigwv.HttpApi(this, "ImportProductsApi", {
      corsPreflight: {
        allowHeaders: ["*"],
        allowOrigins: ["*"],
        allowMethods: [apigwv.CorsHttpMethod.GET]
      }
    });

    httpApi.addRoutes({
      path: "/import",
      methods: [apigwv.HttpMethod.GET],
      integration: new HttpLambdaIntegration("Import products", importProducts)
    });

    const bucket = s3.Bucket.fromBucketName(
      this,
      "ImportServiceBucket",
      BUCKET_NAME
    );

    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3notifications.LambdaDestination(parseProducts),
      {
        prefix: "uploaded/"
      }
    );
  }
}
