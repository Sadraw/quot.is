const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const app = express();
const mysql = require("mysql");
require("dotenv").config({ path: "../mysql.env" });
const apiKey = require("../api-key");

app.use(bodyParser.json());
app.use(cors());

// Middleware for /v1/ endpoint and domain filtering
app.use((req, res, next) => {
  const clientApiKey = req.header("Authorization");
  const requestedDomain = req.hostname;

  // Check if the request is coming from api.quot.is
  if (requestedDomain !== "api.quot.is") {
    return res.status(404).json({ error: "Not Found" });
  }

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
        categoryId: quote.categoryId,
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
        categoryId: randomQuote.categoryId,
      };

      res.json(response);
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
      const categories = result.map((category) => ({
        name: category.name,
      }));
      res.json({ categories });
    }
  });
});

// Load SSL certificate files
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/api.quot.is/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/api.quot.is/fullchain.pem",
  "utf8"
);

const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start the server on the default HTTPS port (443)
httpsServer.listen(5000, "127.0.0.1", () => {
  console.log("Server is doing something on https://api.quot.is");
});
