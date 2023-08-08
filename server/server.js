// Import required modules
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

// Configure middleware
app.use(bodyParser.json());
app.use(cors());

// Middleware for /v1/ endpoint and domain filtering
app.use((req, res, next) => {
  // Get the API key from the request headers
  const clientApiKey = req.header("Authorization");
  // Get the requested domain
  const requestedDomain = req.hostname;

  // Check if the request is coming from api.quot.is
  if (requestedDomain !== "api.quot.is") {
    return res.status(404).json({ error: "Not Found" });
  }

  // Check if a valid API key is provided
  if (!clientApiKey || clientApiKey !== `Bearer ${apiKey}`) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  // Set a welcome message for the endpoint
  res.locals.welcomeMessage = "Welcome to Version 1 of the api.quot.is API";
  console.error("Welcome to Version 1 of quot.is API ")
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

// New endpoint to send random quote while preventing duplicates
app.get("/v1/quote/random", async (req, res) => {
  const clientId = req.query.clientId; // User ID
  const categoryIds = req.query.categoryIds; // Comma-separated category IDs

  try {
    // Fetch sent quote IDs for the user
    const sentQuoteIds = await fetchSentQuoteIds(clientId);

    // Fetch unsent quotes from the chosen categories
    const unsentQuotes = await fetchUnsentQuotes(sentQuoteIds, categoryIds);

    if (unsentQuotes.length === 0) {
      return res.status(404).json({ error: "No unsent quotes available" });
    }

    // Select a random quote from unsentQuotes
    const selectedQuote = getRandomQuote(unsentQuotes);

    // Record the selected quote as sent to the user
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
  console.log(db);
});

// Placeholder functions -- Implement them as we go forward 

// Fetch quote IDs sent to the client
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

// Fetch unsent quotes based on sent quote IDs
async function fetchUnsentQuotes(sentQuoteIds) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM quotes WHERE id NOT IN (?)";
    db.query(sql, [sentQuoteIds], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Select a random quote from the provided array
function getRandomQuote(quotes) {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Record that a quote has been sent to a client
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
