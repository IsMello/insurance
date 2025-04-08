import { type Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    await knex('quotes_test_db.insurance_products')
      .insert([
        {
          name: 'term-life'
        },
        {
          name: 'disability',
        },
      ]).onConflict('name')
      .ignore();

    await knex('quotes_test_db.rate_classes')
      .insert([
        {
          insurance_product_id: 1,
          rate_class: 'preferredPlus',
        },
        {
          insurance_product_id: 1,
          rate_class: 'standard',
        },
        {
          insurance_product_id: 2,
          rate_class: '4A',
        },
        {
          insurance_product_id: 2,
          rate_class: '4M',
        },
      ])

    await knex('quotes_test_db.rates')
      .insert([
        {
          rate_class_id: 1,
          coverage_period: 'term10',
          premium: 4474,
        },
        {
          rate_class_id: 1,
          coverage_period: 'term15',
          premium: 4630,
        },
        {
          rate_class_id: 1,
          coverage_period: 'term20',
          premium: 4697,
        },
        {
          rate_class_id: 1,
          coverage_period: 'term30',
          premium: 4919,
        },
        {
          rate_class_id: 2,
          coverage_period: 'term10',
          premium: 5997,
        },
        {
          rate_class_id: 2,
          coverage_period: 'term15',
          premium: 6215,
        },
        {
          rate_class_id: 2,
          coverage_period: 'term20',
          premium: 6308,
        },
        {
          rate_class_id: 2,
          coverage_period: 'term30',
          premium: 6620,
        },
        {
          rate_class_id: 3,
          coverage_period: '2BP-30EP',
          premium: 4474,
        },
        {
          rate_class_id: 3,
          coverage_period: '2BP-90EP',
          premium: 4630,
        },
        {
          rate_class_id: 3,
          coverage_period: '2BP-180EP',
          premium: 4697,
        },
        {
          rate_class_id: 3,
          coverage_period: '5BP-90EP',
          premium: 4919,
        },
        {
          rate_class_id: 3,
          coverage_period: '5BP-180EP',
          premium: 4999,
        },
        {
          rate_class_id: 4,
          coverage_period: '2BP-30EP',
          premium: 5236,
        },
        {
          rate_class_id: 4,
          coverage_period: '2BP-90EP',
          premium: 5422,
        },
        {
          rate_class_id: 4,
          coverage_period: '2BP-180EP',
          premium: 5503,
        },
        {
          rate_class_id: 4,
          coverage_period: '5BP-90EP',
          premium: 5770,
        },
        {
          rate_class_id: 4,
          coverage_period: '5BP-180EP',
          premium: 5870,
        },
      ])

}
