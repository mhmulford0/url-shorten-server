module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/links.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './data/seeds' },
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './data/cloud-school.sqlite3'
    },
    useNullAsDefault: true
  }

};