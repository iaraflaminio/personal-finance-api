const knexLib = require('knex');
const knexfile = require('../../knexfile');

const knex = knexLib(knexfile.development);

module.exports = knex;