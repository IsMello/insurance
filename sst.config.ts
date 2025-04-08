/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'insurance',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
    };
  },

  async run() {
    const vpc = new sst.aws.Vpc('QuotesVpc', {
      nat: 'ec2',
      bastion: true,
    });
    const mysql = new sst.aws.Aurora('QuotesDatabase', {
      engine: 'mysql',
      vpc,
      database: 'quotes_test_db',
    });

    new sst.aws.Function('MigrationRunnerFunction', {
      handler: 'src/api/handlers/migration-runner.handler',
      timeout: '3 minutes',
      memory: '1024 MB',
      link: [mysql],
      environment: {
        DB_NAME: mysql.database,
        DB_HOST: mysql.host,
        DB_PASSWORD: mysql.password,
        DB_PORT: mysql.port as unknown as string,
        DB_USER: mysql.username,
      },
      vpc,
      nodejs: {
        install: ['mysql2', 'knex'],
      },
      copyFiles: [
        { from: './dist/migrations', to: './migrations' },
        { from: './dist/seeds', to: './seeds' },
      ],
    });

    const api = new sst.aws.ApiGatewayV2('InsuranceAPI');
    api.route('GET /', {
      handler: 'src/api/handlers/get-quote.handler',
    });
    api.route('POST /select-quote', {
      handler: 'src/api/handlers/select-quote.handler',
      link: [mysql],
      url: true,
      environment: {
        DB_NAME: mysql.database,
        DB_HOST: mysql.host,
        DB_PASSWORD: mysql.password,
        DB_PORT: mysql.port as unknown as string,
        DB_USER: mysql.username,
      },
      vpc,
      nodejs: {
        install: ['mysql2', 'knex'],
      },
    });
  },
});
