const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const app = express();
const port = 5000;
const mysql = require("mysql");
require("dotenv").config({ path: "../mysql.env" });
const apiKey = require("../api-key");

const Category = {
  name: String,
};

const Quote = {
  quote: String,
  author: String,
  imageUrl: String,
  categoryId: [Category],
};

app.use(bodyParser.json());
app.use(cors());

// Middleware for /v1/ endpoint
app.use("/v1", (req, res, next) => {
  const clientApiKey = req.header("Authorization");

  if (!clientApiKey || clientApiKey !== `Bearer ${apiKey}`) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  res.locals.welcomeMessage = "Welcome to Version 1 of the api.quot.is API";
  next();
});

// Fetching all quotes (version 1)
app.get("/v1/quotes", (req, res) => {
  const sql = "SELECT * FROM quotes";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching quotes:", err);
      res.status(500).json({ error: "Error fetching quotes" });
    } else {
      res.json(result);
    }
  });
});

// Fetch a single quote by ID (version 1)
app.get("/v1/quote/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM quotes WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching quote:", err);
      res.status(500).json({ error: "Error fetching quote" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Quote not found" });
    } else {
      // Assuming the result is a single quote object from the database
      const quote = result[0];

      // Create the response object with the required fields
      const response = {
        quote: quote.quote,
        author: quote.author,
        imageUrl: quote.imageUrl,
        categories: quote.categoryId, // Assuming the categoryId field holds the list of category IDs
      };

      res.json(response);
    }
  });
});

// Fetch a random quote based on client's preferred categories (version 1)
app.get("/v1/quote", (req, res) => {
  const clientId = req.query.clientId; // Assuming the client sends the clientId as a query parameter
  const categoryIds = req.query.categoryIds; // Assuming the client sends the categoryIds as a query parameter in the format "1,2,3" (comma-separated)

  if (!clientId || !categoryIds) {
    res.status(400).json({
      error: "clientId and categoryIds are required as query parameters",
    });
    return;
  }

  const categoryIdArray = categoryIds.split(",").map((id) => parseInt(id));
  if (categoryIdArray.some(isNaN)) {
    res.status(400).json({
      error:
        "Invalid categoryIds format. Please provide valid comma-separated category IDs.",
    });
    return;
  }

  // Fetch all quotes that have at least one of the specified categoryIds
  const sql = "SELECT * FROM quotes WHERE categoryId IN (?)";
  db.query(sql, [categoryIdArray], (err, result) => {
    if (err) {
      console.error("Error fetching quotes:", err);
      res.status(500).json({ error: "Error fetching quotes" });
    } else if (result.length === 0) {
      res
        .status(404)
        .json({ error: "No quotes found for the specified categories" });
    } else {
      // Randomly select a quote from the fetched quotes
      const randomIndex = Math.floor(Math.random() * result.length);
      const randomQuote = result[randomIndex];

      // Create the response object with the required fields
      const response = {
        quote: randomQuote.quote,
        author: randomQuote.author,
        imageUrl: randomQuote.imageUrl,
        categories: randomQuote.categoryId,
      };

      res.json(response);
    }
  });
});

// Add a new Quote
app.post("/quotes", (req, res) => {
  const { quote, author, imageUrl, categoryId } = req.body;

  // Validate the incoming data
  if (!quote || !author || !categoryId) {
    res.status(400).json({ error: "Quote, author, and category are required" });
    return;
  }

  // Insert the new quote into the database
  const sql =
    "INSERT INTO quotes (quote, author, imageUrl, categoryId) VALUES (?, ?, ?, ?)";
  const values = [quote, author, imageUrl, categoryId];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding quote:", err);
      res.status(500).json({ error: "Error adding quote" });
    } else {
      res.json({
        message: "Quote Added Successfully!",
        quoteId: result.insertId,
      });
    }
  });
});

// Fetch all categories
app.get("/categories", (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ error: "Error fetching categories" });
    } else {
      res.json(result);
    }
  });
});

// Load SSL certificate files
const privateKey = fs.readFileSync(
  "/etc/nginx/ssl/quot_private_key.key",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/nginx/ssl/quot_certificate.pem",
  "utf8"
);

const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

// Change the domain variable to your subdomain name
const domain = "api.quot.is";

httpsServer.listen(port, () => {
  console.log(`Server is doing something on https://${domain}:${port}/`);
});
