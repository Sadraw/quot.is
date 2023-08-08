const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // Make sure to provide the correct path to your database setup
const app = express();
const mysql = require("mysql");
require("dotenv").config({ path: "../mysql.env" });
const apiKey = require("../api-key"); // Provide the correct path to your API key file

app.use(bodyParser.json());
app.use(cors());

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
    const sql = "SELECT * FROM quotes WHERE id NOT IN (?) AND categoryId IN (?)";
    db.query(sql, [sentQuoteIds, categoryIds], (err, result) => {
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

app.get("/v1/quote/random", async (req, res) => {
  console.log("Random Quote Request Received");

  const clientId = req.query.clientId; // User ID
  const categoryIds = req.query.categoryIds; // Comma-separated category IDs

  try {
    console.log("Fetching sent quote IDs...");
    const sentQuoteIds = await fetchSentQuoteIds(clientId);
    console.log("Fetching unsent quotes...");
    const unsentQuotes = await fetchUnsentQuotes(sentQuoteIds, categoryIds);

    if (unsentQuotes.length === 0) {
      return res.status(404).json({ error: "No unsent quotes available" });
    }

    console.log("Selecting a random quote...");
    const selectedQuote = getRandomQuote(unsentQuotes);
    console.log("Recording sent quote...");
    await recordQuoteSent(selectedQuote.id, clientId);

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


