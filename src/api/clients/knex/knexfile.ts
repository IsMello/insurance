import { getKnexConfig } from './environments';
import { Knex } from 'knex';

const config: Knex.Config = getKnexConfig();

export default config;
