require("dotenv").config({ path: "../mysql.env" });
const mysql = require("mysql2/promise"); // Use the promise version of mysql2 library

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
});

// Log the connection configuration
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log("Database connections closing gracefully...");
  pool.end().then(() => {
    console.log("Database connections closed.");
    process.exit(0); // Exit with a success status
    // Perform any cleanup tasks you want, such as logging or saving state.
    // You can also close any resources that need to be explicitly closed.
    // You don't have to close the database connections here.
  });
};

process.on("SIGINT", gracefulShutdown); // Handle Ctrl+C
process.on("SIGTERM", gracefulShutdown); // Handle termination signal

module.exports = pool;
