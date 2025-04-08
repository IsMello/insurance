import { knexClient as knex } from '../clients/knex';

export const handler = async () => {
  try {
    console.log('Starting database migration...');
    const result = await knex.migrate.latest();
    console.log('Migrations completed successfully.', { result });

    console.log('Starting database seed...');
    await knex.seed.run();
    console.log('Seed completed successfully.');

    return {
      message: 'Database migration and seed running completed successfully.',
    };
  } catch (error: any) {
    console.error('Error during database migration and seed running:', error);
    return {
      message: 'Error during database migration and seed running',
      error: {
        message: error.message || 'Unknown error',
        stack: error.stack || 'No stack trace available',
      },
    };
  }
};
