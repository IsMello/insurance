/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "insurance",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  
  async run() {
    const api = new sst.aws.ApiGatewayV2("InsuranceAPI");
    api.route("GET /", {
      handler: "src/api/handlers/get-quote.handler",
    });
  }
});
