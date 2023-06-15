import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { shareLambdaProps } from "./../../product-service/utils/index";
import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";
import * as apigwv from "@aws-cdk/aws-apigatewayv2-alpha";

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const importProducts = new NodejsFunction(this, "importProductsFile", {
      ...shareLambdaProps,
      functionName: "importProducts",
      entry: path.join(__dirname, "..", "lambda", "importProducts.ts")
    });

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
  }
}
