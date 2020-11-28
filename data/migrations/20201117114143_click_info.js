
exports.up = function (knex) {
  return knex.schema.createTable('click_info', (tbl) => {
    tbl.increments();
    tbl.string('location').notNullable();
    tbl.integer('link_id').notNullable().references('links.id');
    tbl.date('click_date').notNullable();
    
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('click_info');
};
