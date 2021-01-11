require('dotenv').config()

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/links.db3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations',
      tableName: 'dbmigrations',
    },
    seeds: {directory: './data/seeds'},
  },

  production: {
    client: 'pg',
    connection: process.env.PG_CONNECT_URI,
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations',
      tableName: 'dbmigrations',
    },
    seeds: {directory: './data/seeds'},
  },
}
