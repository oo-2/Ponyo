const { Pool } = require("pg");
const config = require('../config.json');
const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.name,
  password: config.db.password,
  port: config.db.port,
  ssl: {
    rejectUnauthorized: false
  }
});
module.exports = {

    query: (text, params) => pool.query(text, params)

}