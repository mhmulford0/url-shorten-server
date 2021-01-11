exports.up = function (knex) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.varchar('id').notNullable().unique()
    tbl.string('email').notNullable().unique()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users')
}
