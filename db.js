const { Pool } = require("pg");

const pool = new Pool({
  user: "administrator",
  database: "admin",
  password: "Welcome01!",
  port: 5432,
  host: "localhost",
});

module.exports = { pool };
