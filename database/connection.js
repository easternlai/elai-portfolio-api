const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  //   port: 5432,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: "portfolio",
});

module.exports = pool;
