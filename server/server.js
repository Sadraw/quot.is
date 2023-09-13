// Required modules
const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const dbPool = require("./db");
const app = express();
const apiKey = require("../api-key");
const heapdumpModule = require("./snapshots/heapdumpModule");

// Middleware to validate API key and hostname
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
  next();
});

app.use(bodyParser.json());
app.use(cors());

async function fetchSentQuoteIds(clientId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT quoteId FROM sent_quotes WHERE clientId = ?";
    dbPool.query(sql, [clientId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const sentQuoteIds = result.map((row) => row.quoteId);
        resolve(sentQuoteIds);
      }
    });
  });
}

async function fetchAuthorName(authorId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.text AS quote, a.name AS author
      FROM quotes AS q
      JOIN authors AS a ON q.authorId = a.id
      WHERE q.id = ?;
    `;
    dbPool.query(sql, [authorId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length > 0) {
          resolve(result[0].author);
        } else {
          reject(new Error("Author not found"));
        }
      }
    });
  });
}

async function fetchUnsentQuotes(sentQuoteIds, categoryIds) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT q.*, c.name AS categoryName FROM quotes q LEFT JOIN categories c ON q.categoryId = c.id";
    const placeholders = [];

    if (sentQuoteIds.length > 0) {
      placeholders.push("?".repeat(sentQuoteIds.length));
      sql += ` WHERE q.id NOT IN (${placeholders.join(",")})`;
    }

    if (categoryIds && categoryIds.length > 0) {
      if (placeholders.length === 0) {
        sql += " WHERE";
      } else {
        sql += " AND";
      }
      placeholders.length = 0;
      placeholders.push("?".repeat(categoryIds.length));
      sql += ` q.categoryId IN (${placeholders.join(",")})`;
    }

    dbPool.query(sql, [sentQuoteIds, ...categoryIds], (err, result) => {
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

async function recordQuoteSent(quoteId) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO sent_quotes (quoteId) VALUES (?)";
    dbPool.query(sql, [quoteId], (err, result) => {
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
    dbPool.query(sql, [categoryIds], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const categoryNames = result.map((category) => category.name);
        resolve(categoryNames);
      }
    });
  });
}

app.get("/v1/quote", async (req, res) => {
  console.log("Random Quote Request Received");

  const categoryIds = req.query.categoryIds;

  try {
    console.log("Fetching sent quote IDs...");
    const sentQuoteIds = await fetchSentQuoteIds();

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

    const authorId = selectedQuote.authorId;
    const authorName = await fetchAuthorName(authorId);

    const categoryIdsForSelectedQuote = [selectedQuote.categoryId]; // Fetch category for selected quote only
    const categoryNames = await fetchCategoryNames(categoryIdsForSelectedQuote);

    console.log("Sending response...");
    res.json({
      quote: selectedQuote.text,
      author: authorName,
      imageUrl: selectedQuote.imageUrl,
      categoryNames: categoryNames,
    });
  } catch (error) {
    console.error("Error while fetching and sending a quote:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});


app.get("/categories", (req, res) => {
  const sql = "SELECT name FROM categories";
  dbPool.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ error: "Error fetching categories" });
    } else {
      const categoryNames = result.map((category) => category.name);
      res.json(categoryNames);
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

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
  // heapdumpModule.captureHeapSnapshot("snapshot_after_init.heapsnapshot");
});

// Uncaught Exception Handler
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally, you can perform cleanup or take other actions here.
});
