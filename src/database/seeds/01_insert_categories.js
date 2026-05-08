/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('categories').del()
  await knex('categories').insert([
    { name: 'Food' },
    { name: 'Subscriptions and Services' },
    { name: 'Housing' },
    { name: 'Groceries' },
    { name: 'Personal Care' },
    { name: 'Education' },
    { name: 'Family' },
    { name: 'Leisure' },
    { name: 'Pets' },
    { name: 'Gifts' },
    { name: 'Clothing' },
    { name: 'Health' },
    { name: 'Transport' },
    { name: 'Salary' },
    { name: 'Sales' },
    { name: 'Other Income' },
    { name: 'Other Expenses' }
  ]);
};
