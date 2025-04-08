import knex, { Knex } from 'knex';
import config from './knexfile';

const knexClient: Knex = knex(config);

export { knexClient };
