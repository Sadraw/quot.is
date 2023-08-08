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
      const quote = result[0];
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

// New endpoint to send random quote while preventing duplicates
app.get("/v1/quote/random", async (req, res) => {
  const clientId = req.query.clientId; // User ID
  const categoryIds = req.query.categoryIds; // Comma-separated category IDs

  try {
    const sentQuoteIds = await fetchSentQuoteIds(clientId);
    const unsentQuotes = await fetchUnsentQuotes(sentQuoteIds, categoryIds);

    if (unsentQuotes.length === 0) {
      return res.status(404).json({ error: "No unsent quotes available" });
    }

    const selectedQuote = getRandomQuote(unsentQuotes);
    await recordQuoteSent(selectedQuote.id, clientId);

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


