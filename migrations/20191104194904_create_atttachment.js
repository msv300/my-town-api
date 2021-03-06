exports.up = function (knex) {
  return knex.schema.createTable('attachment', function (t) {
    t.increments('id').unsigned().primary();
    t.bigInteger('createdAt').defaultTo(+new Date());
    t.bigInteger('updatedAt').defaultTo(+new Date());

    t.string('url', 500).notNull();
    t.string('fileDescription', 500).notNull();
    t.integer('creator').nullable().references('id').inTable('user');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('attachment');
};