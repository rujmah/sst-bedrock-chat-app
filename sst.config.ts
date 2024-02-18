import { SSTConfig } from "sst";
import { Api, NextjsSite } from "sst/constructs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export default {
  config(_input) {
    return {
      name: "sst-nextjs-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const api = new Api(stack, "api", {
        defaults: {
          function: {
            initialPolicy: [
              new PolicyStatement({
                effect: Effect.ALLOW,
                actions: [
                  "bedrock-runtime:InvokeModel", // Is this needed?
                  "bedrock:InvokeModel", // This is the permission that worked
                ],
                resources: ["*"], // TODO: restrict to specific model
              }),
            ],
          },
        },
        routes: {
          "POST /titan": {
            function: {
              handler: "src/lambda/titan.handler",
            },
          },
          "POST /llama": {
            function: {
              handler: "src/lambda/llama.handler",
            },
          },
        },
      });

      const site = new NextjsSite(stack, "site", {
        bind: [api],
        environment: {
          API_URL: api.url,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
        apiUrl: api.url,
      });
    });
  },
} satisfies SSTConfig;
