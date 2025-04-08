import { Knex } from "knex";
import path = require("path");
import dotenv from 'dotenv';
dotenv.config();

const extension =
  process.env["NODE_ENV"] === 'test' ? '.ts' : '.js';

export function getKnexConfig(): Knex.Config {
    return {
      client: "mysql2",
      useNullAsDefault: true,
      migrations: {
        directory: path.resolve(__dirname, "./migrations"),
        schemaName: "quotes_test_db",
        loadExtensions: ['.js', '.ts'],
      },
      seeds: {
        extension: extension,
        directory: path.resolve(__dirname, "./seeds"),
      },
      connection: {
        database: process.env['DB_NAME'] || 'quotes_test_db',
        host: process.env['DB_HOST'] || 'localhost',
        password: process.env['DB_PASSWORD'] || 'root',
        port: Number(process.env['DB_PORT']) || 3306,
        user: process.env['DB_USER'] || 'root',
        ssl: { rejectUnauthorized: false}
      },
      pool: {
        min: 0,
        max: 2,
      },
    
  }
}
