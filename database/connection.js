const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "portfoliio",
  password: "portfolio",
  database: "portfolio",
});

module.exports = pool;
