require("dotenv").config({ path: "../mysql.env" });
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10, // Adjust as needed
});

// Log the connection configuration
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

// Log when a new connection is acquired from the pool
pool.on("acquire", (connection) => {
  console.log("Connection %d acquired", connection.threadId);
});

// Log when a connection is released back to the pool
pool.on("release", (connection) => {
  console.log("Connection %d released", connection.threadId);
});

// Log if an error occurs in the connection pool
pool.on("error", (err) => {
  console.error("Connection pool error:", err);
});

// Export the pool instead of the connection
module.exports = pool;

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.message);
//   } else {
//     console.log("Connected to MySQL database!");
//   }
// });
// module.exports = connection;
