const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // DATABASE
const app = express();
const mysql = require("mysql");
require("dotenv").config({ path: "../mysql.env" });
const apiKey = require("../api-key"); // Path to API KEY

// Middleware to validate API key and requested domain
app.use((req, res, next) => {
  const clientApiKey = req.header("Authorization");
  const requestedDomain = req.hostname;

  if (requestedDomain !== "api.quot.is") {
    return res.status(404).json({ error: "Not Found" });
  }

  if (!clientApiKey || clientApiKey !== `Bearer ${apiKey}`) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  res.locals.welcomeMessage = "Welcome to Version 1 of the api.quot.is API";
  console.error("Welcome to Version 1 of quot.is API");
  next();
});

app.use(bodyParser.json());
app.use(cors());

// Saving client-id

async function saveClientId(clientId) {
  if (!clientId) {
    console.log("ClientId not provided. Skipping database insertion.");
    return; // Skip saving the clientId if it is not provided
  }
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO client_ids (clientId) VALUES (?)"; // Column name
    db.query(sql, [clientId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log("ClientId saved in the database.");
        resolve();
      }
    });
  });
}

async function fetchSentQuoteIds(clientId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT quoteId FROM sent_quotes WHERE clientId = ?";
    db.query(sql, [clientId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const sentQuoteIds = result.map((row) => row.quoteId);
        resolve(sentQuoteIds);
      }
    });
  });
}

async function fetchUnsentQuotes(sentQuoteIds, categoryIds) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM quotes";
    const placeholders = [];

    if (sentQuoteIds.length > 0) {
      placeholders.push("?".repeat(sentQuoteIds.length));
      sql += ` WHERE id NOT IN (${placeholders.join(",")})`;
    }

    if (categoryIds && categoryIds.length > 0) {
      if (placeholders.length === 0) {
        sql += " WHERE";
      } else {
        sql += " AND";
      }
      placeholders.length = 0; // Reset the placeholders array
      placeholders.push("?".repeat(categoryIds.length));
      sql += ` categoryId IN (${placeholders.join(",")})`;
    }

    db.query(sql, [sentQuoteIds, ...categoryIds], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getRandomQuote(quotes) {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

async function recordQuoteSent(quoteId, clientId) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO sent_quotes (quoteId, clientId) VALUES (?, ?)";
    db.query(sql, [quoteId, clientId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
async function fetchCategoryNames(categoryIds) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT name FROM categories WHERE id IN (?)";
    db.query(sql, [categoryIds], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const categoryNames = result.map((category) => category.name);
        resolve(categoryNames);
      }
    });
  });
}

app.get("/v1/quote/random", async (req, res) => {
  console.log("Random Quote Request Received");

  const clientId = req.query.clientId; // User ID
  const categoryIds = req.query.categoryIds; // Comma-separated category IDs

  try {
    console.log("Fetching sent quote IDs...");
    const sentQuoteIds = await fetchSentQuoteIds(clientId);

    console.log("Fetching unsent quotes...");
    let unsentQuotes;
    if (categoryIds) {
      const categoryIdsArray = categoryIds.split(",");
      console.log("Category IDs:", categoryIdsArray);
      unsentQuotes = await fetchUnsentQuotes(sentQuoteIds, categoryIdsArray);
    } else {
      unsentQuotes = await fetchUnsentQuotes(sentQuoteIds, []);
    }

    if (unsentQuotes.length === 0) {
      return res.status(404).json({ error: "No unsent quotes available" });
    }

    console.log("Selecting a random quote...");
    const selectedQuote = getRandomQuote(unsentQuotes);
    console.log("Recording sent quote...");
    await recordQuoteSent(selectedQuote.id, clientId);

    // Save clientId in the database
    await saveClientId(clientId);

    console.log("Sending response...");
    res.json({
      quote: selectedQuote.quote,
      author: selectedQuote.author,
      imageUrl: selectedQuote.imageUrl,
      categoryId: selectedQuote.categoryId,
    });
  } catch (error) {
    console.error("Error while fetching and sending a quote:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

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

// Central Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  res.status(500).json({
    error: "Internal Server Error",
  });
});

const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/api.quot.is/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/api.quot.is/fullchain.pem",
  "utf8"
);

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(5000, "127.0.0.1", () => {
  console.log("Server is doing something on https://api.quot.is");
});
