import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigwv from "@aws-cdk/aws-apigatewayv2-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { shareLambdaProps } from "../utils";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProducts = new NodejsFunction(this, "GetProductsLambda", {
      ...shareLambdaProps,
      functionName: "getProducts",
      entry: path.join(__dirname, "..", "handlers", "getProducts.ts")
    });

    const getProductsById = new NodejsFunction(this, "GetProductsByIdLambda", {
      ...shareLambdaProps,
      functionName: "getProductsById",
      entry: path.join(__dirname, "..", "handlers", "getProductsById.ts")
    });

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
  }
}
