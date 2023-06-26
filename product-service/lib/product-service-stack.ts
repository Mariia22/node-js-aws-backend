import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigwv from "@aws-cdk/aws-apigatewayv2-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { shareLambdaProps } from "../utils";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const importQueue = new sqs.Queue(this, "importProductsQueue", {
      queueName: "importProductsQueue"
    });

    const catalogBatchProcess = new NodejsFunction(
      this,
      "catalogBatchProcess",
      {
        ...shareLambdaProps,
        functionName: "catalogBatchProcess",
        entry: path.join(__dirname, "..", "handlers", "catalogBatchProcess.ts")
      }
    );

    catalogBatchProcess.addEventSource(
      new SqsEventSource(importQueue, { batchSize: 5 })
    );

    const getProducts = new NodejsFunction(this, "GetProductsLambda", {
      ...shareLambdaProps,
      functionName: "getProducts",
      entry: path.join(__dirname, "..", "handlers", "getProducts.ts")
    });

    getProducts.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Scan"],
        resources: ["*"]
      })
    );

    const getProductsById = new NodejsFunction(this, "GetProductsByIdLambda", {
      ...shareLambdaProps,
      functionName: "getProductsById",
      entry: path.join(__dirname, "..", "handlers", "getProductsById.ts")
    });

    getProductsById.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: ["*"]
      })
    );

    const createProduct = new NodejsFunction(this, "CreateProductLambda", {
      ...shareLambdaProps,
      functionName: "createProduct",
      entry: path.join(__dirname, "..", "handlers", "createProduct.ts")
    });

    createProduct.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: ["*"]
      })
    );

    // Defines API Gateway
    const httpApi = new apigwv.HttpApi(this, "ProductApi", {
      corsPreflight: {
        allowHeaders: ["*"],
        allowOrigins: ["*"],
        allowMethods: [apigwv.CorsHttpMethod.GET]
      }
    });

    // Defines routes
    httpApi.addRoutes({
      path: "/products",
      methods: [apigwv.HttpMethod.GET],
      integration: new HttpLambdaIntegration("Get products", getProducts)
    });

    httpApi.addRoutes({
      path: "/products/{productId}",
      methods: [apigwv.HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "Get products by id",
        getProductsById
      )
    });

    httpApi.addRoutes({
      path: "/products",
      methods: [apigwv.HttpMethod.POST],
      integration: new HttpLambdaIntegration("Create product", createProduct)
    });
  }
}
