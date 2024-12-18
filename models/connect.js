const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // If you're using the dotenv package

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT || 1433; // Default to 1433 if not provided

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  port: dbPort,
  host: dbHost,
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true, // For Azure SQL
      enableArithAbort: true,
    },
  },
  logging: false, // Disable SQL logging in console for cleaner output
  pool: {
    max: 5, // maximum number of connection in pool
    min: 0, // minimum number of connection in pool
    idle: 10000, // connection idle time (ms) before being closed
  },
});

//Det her en ændring

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = sequelize;
