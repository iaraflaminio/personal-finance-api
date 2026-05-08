/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.string('description').notNullable();
    table.integer('amount').notNullable();
    table.timestamp('date').notNullable();

    table.integer('category_id').unsigned().notNullable();
    table.foreign('category_id').references('id').inTable('categories');

    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');

    table.string('type').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};
