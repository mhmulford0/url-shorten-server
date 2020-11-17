const { table } = require('../dbConfig');

exports.up = function (knex) {
  return knex.schema.createTable('click_info', (tbl) => {
    tbl.increments();
    tbl.string('location').notNullable();
    tbl.integer('link_id').notNullable().references('links.id');
  });
};

exports.down = function (knex) {
  return dropTableIfExists('click_info');
};
