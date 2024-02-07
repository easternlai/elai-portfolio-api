const express = require("express");
const bodyParser = require("body-parser");

const pool = require("./database/connection");
const { Client } = require("pg");

const app = express();
const PORT = 6001; // You can choose any available port
const DB_NAME = "portfolio";

app.use(bodyParser.json());

//CORS settup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

async function createDatabaseAndTable() {
  try {
    // Create database if it doesn't exist
    const client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        message TEXT
      );
    `);

    console.log("Database and table created successfully");
    client.release();
  } catch (error) {
    console.error("Error creating database and table:", error);
  }
}

// Middleware to create database and table on server startup
app.use(async (req, res, next) => {
  await createDatabaseAndTable();
  next();
});

app.post("/api/contact", async (req, res) => {
  const formData = req.body;

  try {
    // Insert data into the table
    const result = await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [formData.name, formData.email, formData.message]
    );

    console.log("Form data inserted:", result.rows[0]);
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error inserting form data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
