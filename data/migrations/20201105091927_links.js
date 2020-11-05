exports.up = function (knex) {
  return knex.schema.createTable("links", (tbl) => {
    tbl.increments();
    tbl.string("longLink");
    tbl.string("shortLink");
    tbl.integer("clicks");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("links");
};
