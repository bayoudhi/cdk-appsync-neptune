import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as neptune from "@aws-cdk/aws-neptune-alpha";

export class AppsyncNeptuneStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "NeptuneAPI",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    const vpc = new ec2.Vpc(this, "NewNeptuneVPC");

    const lambdaFn = new lambda.Function(this, "Lambda Function", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("lambda-fns"),
      memorySize: 1024,
      vpc,
    });

    // set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource("lambdaDatasource", lambdaFn);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listUsers",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createUser",
    });

    const cluster = new neptune.DatabaseCluster(this, "NeptuneCluster", {
      vpc,
      instanceType: neptune.InstanceType.T3_MEDIUM,
    });

    cluster.connections.allowDefaultPortFromAnyIpv4("Open to the world");

    const writeAddress = cluster.clusterEndpoint.socketAddress;

    new CfnOutput(this, "writeaddress", {
      value: writeAddress,
    });

    const readAddress = cluster.clusterReadEndpoint.socketAddress;

    new CfnOutput(this, "readaddress", {
      value: readAddress,
    });

    lambdaFn.addEnvironment("WRITER", writeAddress);
    lambdaFn.addEnvironment("READER", readAddress);
  }
}
